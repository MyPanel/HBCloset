const previewImage = (targetObj, View_area) => {
	var preview = document.getElementById(View_area); //div id
	var ua = window.navigator.userAgent;

  //ie일때(IE8 이하에서만 작동)
	if (ua.indexOf("MSIE") > -1) {
		targetObj.select();
		try {
			var src = document.selection.createRange().text; // get file full path(IE9, IE10에서 사용 불가)
			var ie_preview_error = document.getElementById("ie_preview_error_" + View_area);


			if (ie_preview_error) {
				preview.removeChild(ie_preview_error); //error가 있으면 delete
			}

			var img = document.getElementById(View_area); //이미지가 뿌려질 곳

			//이미지 로딩, sizingMethod는 div에 맞춰서 사이즈를 자동조절 하는 역할
			img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+src+"', sizingMethod='scale')";
		} catch (e) {
			if (!document.getElementById("ie_preview_error_" + View_area)) {
				var info = document.createElement("<p>");
				info.id = "ie_preview_error_" + View_area;
				info.innerHTML = e.name;
				preview.insertBefore(info, null);
			}
		}
  //ie가 아닐때(크롬, 사파리, FF)
	} else {
		var files = targetObj.files;
		for ( var i = 0; i < files.length; i++) {
			var file = files[i];
			var imageType = /image.*/; //이미지 파일일경우만.. 뿌려준다.
			if (!file.type.match(imageType))
				continue;
			var prevImg = document.getElementById("prev_" + View_area); //이전에 미리보기가 있다면 삭제
			if (prevImg) {
				preview.removeChild(prevImg);
			}
			var img = document.createElement("img"); 
			img.id = "prev_" + View_area;
			img.classList.add("obj");
			img.file = file;
			img.style.width = '100%'; 
			img.style.height = '100%';
			preview.appendChild(img);
			if (window.FileReader) {
				var reader = new FileReader();
				reader.onloadend = (function(aImg) {
					return function(e) {
						aImg.src = e.target.result;
					};
				})(img);
				reader.readAsDataURL(file);
			} else { // safari is not supported FileReader
				//alert('not supported FileReader');
				if (!document.getElementById("sfr_preview_error_"
						+ View_area)) {
					var info = document.createElement("p");
					info.id = "sfr_preview_error_" + View_area;
					info.innerHTML = "not supported FileReader";
					preview.insertBefore(info, null);
				}
			}
		}
	}
}

const click_addPicture = () => {
	// var editForm = document.getElementsByClassName('loginForm');
	var idForm = document.createElement('div');
	var inputFile = document.createElement('input');
	var viewArea = document.createElement('div');

	var imagelength = document.getElementsByClassName('idForm').length;

	console.log("총 이미지의 개수는 "+imagelength+"입니다.");
	idForm.setAttribute('class','idForm');
	inputFile.setAttribute('type','file');
	inputFile.setAttribute('name','img');
	inputFile.setAttribute('onchange',"previewImage(this,'View_area"+imagelength+"')");
	viewArea.setAttribute('id','View_area'+imagelength+'');

	idForm.appendChild(inputFile);
	idForm.appendChild(viewArea);

	document.getElementsByClassName('images').item(0).append(idForm);
}

const image_delete = (i,imgUrl) => {
	var selectedImgurl = document.getElementById(imgUrl).value;
	var name = document.getElementsByClassName('id').item(0).value;
	var imgNum = i
	var data = {url:selectedImgurl,name:name, imgNum};
	var tagCounter = (document.getElementsByClassName('images').item(0).childElementCount-1)/3;
		document.getElementById('img'+i).remove();
		document.getElementById(imgUrl).remove();
		document.getElementById(i).remove();



		fetch('/closet/deleteImage',{
					headers: {
						'Content-Type': 'application/json',
					},
					method: "POST",
					body:JSON.stringify(data)
		}).then(res => res.json())
		.then(response => {
			console.log('Success');
			var count = JSON.stringify(response.nowFileslength);
			for(var j=Number(i)+1;j<=count;j++) {
				if(Number(i)==tagCounter) {
					break;
				}
				
				var imgstrB = 'img' + j;
				var urlstrB = 'imgUrl' + j;
				var btnstrB = '' + j;
		
				var imgstrA = 'img' + (j-1);
				var urlstrA = 'imgUrl' + (j-1);
				var btnstrA = (j-1)+'';
		
				var beforeImg = document.getElementById(imgstrB);
				var beforeUrl = document.getElementById(urlstrB) //10+j-1
				var beforeBtn = document.getElementById(btnstrB);
		
				beforeImg.setAttribute('id',imgstrA)
				beforeUrl.setAttribute('id',urlstrA);
				beforeBtn.setAttribute('id',btnstrA);
				beforeBtn.setAttribute('onclick',"image_delete('"+(j-1)+"','imgUrl"+(j-1)+"')")
			}
		})
	
	}

const idChangeTool = (num) => {

}