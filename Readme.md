# DCFWY

Türkiye'de Discord'a getirilen erişim engeli nedeniyle Discord bot listesi sitelerinde kullanılan CDN bağlantılarındaki resimler (örn. profil fotoğrafları, emoji ikonları, vs.) yüklenememektedir. Bu sorun, resimlerin `cdn.discordapp.com` üzerinden sunucuya erişememesinden kaynaklanmaktadır. Bu rehber, Türkiye'deki kullanıcıların resimleri sorunsuz bir şekilde görüntülemesi için bir proxy çözümü sunar.

## Çözüm

Bu çözüm, Discord CDN (Content Delivery Network) isteklerini kendi sunucunuzda proxy'leyerek resimlerin erişim engelini aşmasını sağlar. Proxy sunucusu, Discord CDN'den gelen resimleri alır ve bu resimleri kullanıcılara Türkiye'de de erişilebilir hale getirir.

### 1. Kurulum


```bash
git clone https://github.com/kardespro/dcfwy
cd dcfwy
npm i
```

### 2. Config dosyasını Yapılandırma

Kendinize uygun olarak ```config.yml``` dosyasını yapılandırın

### 3. Sunucuyu Başlatma

```bash
npm run dcfwy
```

### Not: Railway,Replit gibi platformlarda kurup calistira bilirsiniz 

[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?name=dcfwy&type=git&repository=kardespro%2Fdcfwy&branch=main&builder=buildpack&regions=was&env%5B%5D=&ports=3000%3Bhttp%3B%2F)
