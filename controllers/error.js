
exports.notFound = (req,res,next)=>{  
    res.status(404).render('404',
    {
        pageTitle:"Page not found",
        formsCSS:false,
        productCSS:false,
        path:null
    });
}