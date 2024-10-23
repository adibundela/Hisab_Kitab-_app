const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')



app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(express.urlencoded({ extended:true }))


app.get("/", (req, res) =>{
   fs.readdir('./hisab',(err,files)=>{
    if(err) return res.status(500).send(err);
    res.render('index',{files:files})
   })
    
})

app.get('/create',(req,res)=>{
    res.render('create')
})

app.post('/createhisab',(req,res)=>{
    
    if(req.body.title){
        fs.writeFile(`./hisab/${req.body.title}.txt`,req.body.data,(err)=>{
            if(err) return res.status(500).send(err);
            res.redirect('/')
        })
    }
    const today = new Date();
    const day = String(today.getDate()).padStart(2, ''); // Get day and pad with zero if needed
    const month = String(today.getMonth() + 1).padStart(2, ''); // Get month and pad with zero (months are zero-indexed)
    const year = String(today.getFullYear()).slice(-2); // Get last two digits of the year

    const date= `${day}-${month}-${year}`;
    fs.writeFile(`./hisab/${date}.txt`,req.body.data,(err)=>{
        if(err) return res.status(500).send(err);
        res.redirect('/')
    })
})

 app.get('/edit/:hisabid',async(req,res)=>{
    
            fs.readFile(`./hisab/${req.params.hisabid}`,'utf-8',(err, data)=>{
            if(err) return res.status(500).send(err);
            console.log(data);
            res.render('edit',{filename:req.params.hisabid, data})
        }
        )
       
    
    
 })
 app.post('/edithisab/:hisabid',(req,res)=>{
    fs.writeFile(`./hisab/${req.params.hisabid}`,req.body.data,(err)=>{
        if(err) return res.status(500).send(err);
        res.redirect('/')
    })
 })
 app.get('/showhisab/:hisabid',(req,res)=>{
    fs.readFile(`./hisab/${req.params.hisabid}`,'utf-8',(err,data)=>{
        if(err) return res.status(500).send(err);

        
        res.render('hisab',{filename:req.params.hisabid,data})
    })
 })


 app.get('/delete/:hisabid',(req,res)=>{
    fs.unlink(`./hisab/${req.params.hisabid}`,(err)=>{
        if(err) res.status(500).send(err)
        res.redirect('/')
    })
 })

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})