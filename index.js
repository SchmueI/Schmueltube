const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const fs = require('fs');
const app = express();
const imageDownloader = require("image-downloader");

app.use(cors());

app.listen(4000, () => {
    console.log('Server Works !!! At port 4000');
});

app.get('/download', (req,res) => {
		var URL = req.query.URL;

		/*res.header('Content-Disposition', 'attachment; filename="video.mp4"');*/
		/*ytdl(URL, {format: 'mp4'}).pipe(res);*/
		
		//ytdl(URL, {format: 'mp4'}).pipe(fs.createWriteStream(gettheytdl(URL)+".mp4"));

		
		async function gettheytdl(URL){
			var getinfo = await ytdl.getBasicInfo(URL);
			var title = getinfo.videoDetails.title;
			var author = getinfo.videoDetails.author.name;
			var thumbnail = getinfo.videoDetails.thumbnails[1].url;
			var likes = getinfo.videoDetails.likes;
			var dislikes = getinfo.videoDetails.dislikes;			
			
			title=title.replace("|", "-");
			title=title.replace("/", "");
			title=title.replace("\\", "");
			title=title.replace("*", "");
			title=title.replace("\"", "");
			title=title.replace("?", "");
			title=title.replace(":", "");
			title=title.replace("<", "");
			title=title.replace(">", "");
			title=title.replace("\"", "");
			title=title.replace("'", "");
			title=title.replace("&", "und");
			
			author=author.replace("|", "-");
			author=author.replace("/", "");
			author=author.replace("\\", "");
			author=author.replace("*", "");
			author=author.replace("\"", "");
			author=author.replace("?", "");
			author=author.replace(":", "");
			author=author.replace("<", "");
			author=author.replace(">", "");
			author=author.replace("\"", "");
			author=author.replace("'", "");
			author=author.replace("&", "und");
			
			rellike=likes/(likes+dislikes)*100;
			
			fs.writeFile(
				author+" - "+title+".txt", ""+rellike, 
				function (err) {
					if (err) return console.log(err);
				}
			);

			const options = {
				url: thumbnail,
				dest: author+" - "+title+".jpg",
			};
			imageDownloader
				.image(options)
				.then(
					({ filename }) => {
						console.log("file saved" + filename);
					}
				)
  .catch((err) => console.error(err));			
			ytdl(URL, {format: 'mp4'}).pipe(fs.createWriteStream(author+" - "+title+".mp4"));
		}
		
		gettheytdl(URL)
		setTimeout(finish, 1500);
		
		function finish(){return res.redirect('http://192.168.178.129');}
	}
);
