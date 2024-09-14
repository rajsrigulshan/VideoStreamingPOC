import express from "express"
import cors from "cors"
import multer from "multer"
import {v4 as uuidv4} from "uuid"
import path from "path"
import fs from "fs"
import { exec } from "child_process"
// import { error } from "console"
import { stderr, stdout } from "process"

const app=express()


// multer middl eware...

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads")
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"_"+uuidv4()+path.extname(file.originalname))
    }
})

// multer configuration....
const upload=multer({storage:storage});


app.use(
    cors({
        origin:["http://localhost:8000","http://localhost:5173"],
        credentials: true
    })
)
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next()
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/uploads",express.static("uploads"))

app.get('/',function(req,res){
    res.json({message:"hello world!!!"})
})

// route to handle the uploadin the video

app.post("/upload",upload.single('file'),function(req,res){
    // console.log("file is uploading....")
    // res.send("file uploaded successfully..")

    const lessonId=uuidv4()
    const videoPath=req.file.path
    const outputPath=`./uploads/courses/${lessonId}`
    const hlsPath=`${outputPath}/index.m3u8`
    console.log("hlsPath   ",hlsPath) 

    if(!fs.existsSync(outputPath)){
            fs.mkdirSync(outputPath,{recursive:true})  // recursively create directory if not present
    }
    
    // ffmpeg command for frame division
        const ffmpegFrameDivCmd = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

        exec(ffmpegFrameDivCmd, (error,stdout,stderr)=>{
            if(error){
                console.log(`excution error: ${error}`)
            }
            console.log(`stdout: ${stdout}`)
            console.log(`stderr: ${stderr}`)
            const videoUrl=`http://localhost:8000/uploads/courses/${lessonId}/index.m3u8`;

            res.json({
                message:"video converted to HLS formate",
                videoUrl:videoUrl,
                lessonId:lessonId
            })
        })

})

app.listen(8000,function(){
    console.log("listning on port 8000 .....")
})