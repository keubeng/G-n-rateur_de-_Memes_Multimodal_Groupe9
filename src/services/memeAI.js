 export const generateMeme = async (prompt) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        text: "Meme généré : " + prompt,
        image: "https://i.imgflip.com/30b1gx.jpg"
      });
    }, 1000);
  });
};