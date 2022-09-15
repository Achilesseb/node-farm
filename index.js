const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');
/////////////////////////////////////////////Server
const productsData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const templateOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf8');
const templateCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf8');
const productsDataObject = JSON.parse(productsData);
const slugs = productsDataObject.map((product) => slugify(product.productName, { lower: true }));
console.log(slugs);
console.log(slugify('Fresh Avocados', { lower: true }));
const server = http.createServer((req, res) => {
   const { query, pathname } = url.parse(req.url, true);

   //Overview path
   if (pathname === '/overview' || pathname === '/') {
      res.writeHead(200, {
         'Content-type': 'text/html',
      });
      const cardsHtml = productsDataObject.map((product) => replaceTemplate(templateCard, product)).join('');
      const outputHtml = templateOverview.replace(/{%PRODUCTCARDS%}/g, cardsHtml);
      res.end(outputHtml);
   }
   //  Product path
   else if (pathname === '/product') {
      const productToDisplay = productsDataObject[query.id];
      res.writeHead(200, {
         'Content-type': 'text/html',
      });
      const outputHtml = replaceTemplate(templateProduct, productToDisplay);
      res.end(outputHtml);
   }
   //Api path
   else if (pathname === '/api') {
      res.writeHead(200, {
         'Content-type': 'application/json',
      });
      res.end(productsData);
   }
   //Not found path
   else {
      res.writeHead(404, {
         'Content-type': 'text/html',
      });
      res.end('<h1>Page not Found!<h1>');
   }
});

server.listen(8000, '127.0.0.1', () => {
   console.log('Server has been started on port 8000!');
});

/////////////////////////////////////////////Files
////Synchronoys way of doing things

// const inputText = fs.readFileSync("./txt/input.txt", {encoding: "utf8"});
// console.log(inputText);
// const textToAdd = `${inputText} and omega-3 and 6 fats`;
// fs.writeFileSync("./txt/outputText.txt", textToAdd);
// console.log("File has been written!");

// fs.readFile("./txt/outputText.txt", "utf8", (err, data)=>{
//     console.log(data);
// })
// console.log("Action happend!");

////Asynchronous way of doing things 😁

// fs.readFile("./txt/start.txt", "utf8", (err, data) => {
//   if (err) return console.log("ERROR! 🤬");
//   console.log(data);
//   fs.readFile(`./txt/${data}.txt`, "utf8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Files have been written! 😎");
//       });
//     });
//   });
// });
