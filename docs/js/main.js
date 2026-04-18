!(async function(){
	let pdfDocument, fileName;
	const dropZone = document.querySelector(".wrapper"),
		uploadBox = document.querySelector(".upload-box"),
		fileInput = uploadBox.querySelector("input"),
		downloadButton = document.querySelector(".download-btn"),
		cancelButton = document.querySelector(".cancel-btn"),
		title = document.querySelector("#title"),
		subject = document.querySelector("#subject"),
		author = document.querySelector("#author"),
		keywords = document.querySelector("#keywords"),
		resetFileInput = () => {
			fileInput.type = "text";
			setTimeout(() => {
				fileInput.type = "file";
			}, 1);
		},
		resetForm = () => {
			resetFileInput();
			dropZone.classList.remove("active");
			dropZone.classList.remove("hover");
			dropZone.classList.remove("error");
			title.value = "";
			subject.value = "";
			author.value = "";
			keywords.value = "";
		},
		loadFile = (file) => {
			dropZone.classList.remove("hover");
			dropZone.classList.remove("error");
			if(file) {
				switch(file.type){
					case "application/pdf":
						// Добро
						dropZone.classList.add("active");
						fileName = file.name;
						// Загружаем PDF файл
						loadPdfFile(file);
						break;
					default:
						// Нельзя
						pdfDocument = null;
						dropZone.classList.remove("active");
						dropZone.classList.add("hover");
						dropZone.classList.add("error");
						resetFileInput();
						setTimeout(() => {
							dropZone.classList.remove("hover");
							dropZone.classList.remove("error");
						}, 1000);
						break;
				}
			}
		},
		loadPdfFile = (file) => {
			let reader = new FileReader();
			reader.onload = (e) => {
				readPdfFile(e.target.result);
			}
			reader.readAsArrayBuffer(file);
		},
		readPdfFile = async (arrayBuffer) => {
			pdfDocument = await PDFLib.PDFDocument.load(arrayBuffer, {
				updateMetadata: true
			});
			title.value = pdfDocument.getTitle() ? pdfDocument.getTitle() : "";
			subject.value = pdfDocument.getSubject() ? pdfDocument.getSubject() : "";
			author.value = pdfDocument.getAuthor() ? pdfDocument.getAuthor() : "";
			keywords.value = pdfDocument.getKeywords() ? pdfDocument.getKeywords() : "";
		},
		downloadBtnEvent = async (e) => {
			if(pdfDocument){
				pdfDocument.setTitle(title.value);
				pdfDocument.setSubject(subject.value);
				pdfDocument.setAuthor(author.value);
				let keys = keywords.value.split(",");
				pdfDocument.setKeywords(keys);
				let pdfBytes = await pdfDocument.save();
				let blob = new Blob([pdfBytes], { type: "application/pdf" });
				let downloadElement = document.createElement("a");
				let data = window.URL.createObjectURL(blob);
				downloadElement.href = data;
				downloadElement.download = `${fileName}`;
				downloadElement.click();
				setTimeout(()=> {
					window.URL.revokeObjectURL(data);
					downloadElement.remove();
				}, 100);
			}
		},
		clickSelectFile = (e) => {
			let file;
			if(e.target.files.length) {
				file = e.target.files[0];
			}
			loadFile(file);
		},
		dragEvents = (e) => {
			if(dropZone.classList.contains("active"))
				return true;
			const fileItems = [...e.dataTransfer.items].filter(
				(item) => item.kind === "file",
			);
			e.preventDefault();
			dropZone.classList.add("hover");
			fileItems[0].type !== "application/pdf" && dropZone.classList.add("error");
		};

	// Reset
	resetForm();

	// File Input Change
	fileInput.addEventListener("change", clickSelectFile);

	// Upload box click
	uploadBox.addEventListener("click", (e) => fileInput.click());

	// Download button
	downloadButton.addEventListener("click", downloadBtnEvent);

	// Cancel button
	cancelButton.addEventListener("click", resetForm);

	// Drag and Drop
	dropZone.addEventListener("dragenter", dragEvents);
	dropZone.addEventListener("dragover", dragEvents);
	dropZone.addEventListener("dragleave", function(e) {
		if(dropZone.classList.contains("active"))
			return true;
		e.preventDefault();
		dropZone.classList.remove("hover");
		dropZone.classList.remove("error");
	});
	dropZone.addEventListener("drop", function(e) {
		if(dropZone.classList.contains("active"))
			return true;
		e.preventDefault();
		dropZone.classList.remove("hover");
		dropZone.classList.remove("error");
		let files = Array.from(e.dataTransfer.files),
			file = files[0];
		loadFile(file);
	});
}());

