const express = require('express')
const app = express()
const jsonParser = express.json()
const Parser = require('rss-parser')
const parser = new Parser()
 

//engine
app.set("view engine","ejs") 
//main page
let firstPage = async (req,res)=>{

	let news = await parser.parseURL('https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en')

	let firstNews = news.items.splice(0,5)
	res.render('index',{firstNews:firstNews})
}

//ajax request for getting new news
let newNews = async (req,res)=>{
	let numberPage = req.query.page-1
	//parse data
	let news = await parser.parseURL('https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en')
	//get some titles 
	let nextNews = news.items.splice(numberPage*5,5)

	//set only titles

	nextNews = nextNews.map((el)=>{
		return el.title
	})

	//last step before sending	
	nextNews = {
		newNews:nextNews,
		page:req.query.page,
	}

	nextNews = JSON.stringify(nextNews)

	res.end(nextNews)

}
app.get('/', firstPage)
app.get('/news',jsonParser,newNews)
 
app.listen(3000)