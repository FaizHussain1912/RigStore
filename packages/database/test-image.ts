import google from 'googlethis';

async function test() {
  const images = await google.image('site:amazon.com "Intel Core i9-14900K" box', { safe: false });
  console.log("Images found:", images.length);
  if (images.length > 0) {
    console.log(images[0].preview.url);
    console.log(images[0].url);
  }
}

test();
