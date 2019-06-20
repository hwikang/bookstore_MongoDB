const path =require('path')
//mainModule 은 app.js 의 파일명+경로 를 반환
//dirname 에 넣으면 파일명 빼고 경로만 반환      
module.exports=path.dirname(process.mainModule.filename);