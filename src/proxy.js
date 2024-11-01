const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const redis = require("async-redis");
const fs = require("fs");
const yaml = require("yaml");
const path = require("path");

class startDcfwy {
  constructor() {
    const configPath = path.join(__dirname, "../config.yml");

    const file = fs.readFileSync(configPath, "utf8");
    this.config = yaml.parse(file);

    this.redisClient = redis.createClient({
      host: this.config.redis.host,
      port: this.config.redis.port,
      password: this.config.redis.password || undefined,
      db: this.config.redis.db,
    });

    this.CACHE_DURATION = this.config.cache.duration;

    this.app = express();
    this.setupRoutes();
  }

  setupRoutes() {
    this.app.use("/*", async (req, res, next) => {
      const cacheKey = req.originalUrl;
      try {
        const cachedData = await this.redisClient.get(cacheKey);

        if (cachedData) {
          const cachedResponse = JSON.parse(cachedData);

          for (const header in cachedResponse.headers) {
            res.setHeader(header, cachedResponse.headers[header]);
          }

          
          res.send(cachedResponse.body);
        } else {
          console.log(`CDN'e istek yapılıyor: ${cacheKey}`);
          next();
        }
      } catch (err) {
        console.error("Redis hatası:", err);
        next();
      }
    });

    
    this.app.use(
      "/*",
      createProxyMiddleware({
        target: "https://cdn.discordapp.com",
        changeOrigin: true,
        selfHandleResponse: true,
        onProxyRes: async (proxyRes, req, res) => {
          let responseBody = "";
          res.setHeader("x-proxy-app","kardespro/dcfwy")
          Object.keys(proxyRes.headers).forEach((header) => {
            res.setHeader(header, proxyRes.headers[header]);
          });

          proxyRes.on("data", (chunk) => {
            responseBody += chunk.toString("utf-8");
          });
          proxyRes.on("end", async () => {
            try {
              const cacheKey = req.originalUrl;

              await this.redisClient.setex(
                cacheKey,
                this.CACHE_DURATION,
                JSON.stringify({
                  headers: proxyRes.headers,
                  body: responseBody,
                })
              );
              console.log(`Cache'e kaydedildi: ${cacheKey}`);
              res.send(responseBody);
            } catch (err) {
              console.error("DCFWY Cachelerken hata oluștu:", err);
              res.status(500).send("Bir hata oluştu");
            }
          });
        },
      })
    );
  }

  startServer() {
    const PORT = this.config.server.port;
    this.app.listen(PORT, () => {
      console.log(`DCFWY Proxy: http://localhost:${PORT}`);
    });
  }
}

module.exports = startDcfwy;
