const modal = document.getElementById("toolModal");
const app = document.getElementById("toolApp");
const closeModal = document.getElementById("closeModal");
const toast = document.getElementById("toast");
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

let selectedFiles = [];
let currentObjectURLs = [];


/* =========================
   MOBILE MENU
========================= */

menuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});

document.querySelectorAll("#mobileMenu a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
  });
});


/* =========================
   MODAL
========================= */

closeModal.addEventListener("click", closeTool);

modal.addEventListener("click", e => {
  if (e.target === modal) {
    closeTool();
  }
});

function closeTool(){

  modal.classList.remove("open");

  currentObjectURLs.forEach(url => {
    URL.revokeObjectURL(url);
  });

  currentObjectURLs = [];
  selectedFiles = [];

  app.innerHTML = "";
}


/* =========================
   TOOL DEFINITIONS
========================= */

const tools = {

  compress:{
    title:"Smart Compressor",
    description:"Reduce image size while controlling quality.",
    multiple:false
  },

  convert:{
    title:"Image Converter",
    description:"Convert JPG, PNG and WebP directly in your browser.",
    multiple:false
  },

  pdf:{
    title:"Images → PDF",
    description:"Select multiple images, preview them and create a real PDF.",
    multiple:true
  },

  metadata:{
    title:"Metadata Cleaner",
    description:"Create a fresh re-encoded image without common embedded metadata.",
    multiple:false
  },

  colors:{
    title:"Color Extractor",
    description:"Extract the most common colors from an image.",
    multiple:false
  },

  split:{
    title:"Image Splitter",
    description:"Divide an image into equal grid tiles.",
    multiple:false
  },

  ratio:{
    title:"Aspect Ratio Cropper",
    description:"Crop the center of an image into a common ratio.",
    multiple:false
  },

  stitch:{
    title:"Image Stitcher",
    description:"Join two or more images vertically or horizontally.",
    multiple:true
  }

};


/* =========================
   OPEN TOOL
========================= */

document.querySelectorAll(".tool-card").forEach(card => {

  card.querySelector("button").addEventListener("click", () => {

    openTool(card.dataset.tool);

  });

});


function openTool(type){

  const tool = tools[type];

  selectedFiles = [];

  app.innerHTML = `

    <div class="tool-ui">

      <h2>${tool.title}</h2>

      <p>${tool.description}</p>

      <div class="drop-zone">

        <label class="file-label">

          <span class="pick-button">
            Choose image${tool.multiple ? "s" : ""}
          </span>

          <input
            id="filePicker"
            type="file"
            accept="image/*"
            ${tool.multiple ? "multiple" : ""}
          >

        </label>

        <div id="previewArea" class="preview-area">

          <span class="empty-preview">
            No image selected yet.
          </span>

        </div>

      </div>

      <div id="toolControls"></div>

      <div id="toolResult"></div>

    </div>

  `;


  const picker = document.getElementById("filePicker");

  picker.addEventListener("change", event => {

    selectedFiles = [...event.target.files];

    renderPreviews();

  });


  setupControls(type);

  modal.classList.add("open");
}


/* =========================
   IMAGE PREVIEWS
========================= */

function renderPreviews(){

  const area = document.getElementById("previewArea");

  if (!area) return;

  currentObjectURLs.forEach(url => {
    URL.revokeObjectURL(url);
  });

  currentObjectURLs = [];

  area.innerHTML = "";

  if (selectedFiles.length === 0){

    area.innerHTML = `
      <span class="empty-preview">
        No image selected yet.
      </span>
    `;

    return;
  }


  selectedFiles.forEach((file,index) => {

    const url = URL.createObjectURL(file);

    currentObjectURLs.push(url);

    const wrapper = document.createElement("div");

    wrapper.className = "thumb";

    wrapper.innerHTML = `

      <button class="remove-image">
        ×
      </button>

      <img src="${url}" alt="Selected image">

      <span>${escapeHTML(file.name)}</span>

    `;


    wrapper
      .querySelector(".remove-image")
      .addEventListener("click", () => {

        selectedFiles.splice(index,1);

        renderPreviews();

      });


    area.appendChild(wrapper);

  });

}


/* =========================
   CONTROLS
========================= */

function setupControls(type){

  const controls = document.getElementById("toolControls");

  if (!controls) return;


  if (type === "compress"){

    controls.innerHTML = `

      <div class="controls">

        <div class="control">

          <label>
            Quality
            <span id="qualityValue">75%</span>
          </label>

          <input
            id="quality"
            type="range"
            min="10"
            max="100"
            value="75"
          >

        </div>


        <div class="control">

          <label>
            Output format
          </label>

          <select id="format">

            <option value="image/webp">
              WEBP
            </option>

            <option value="image/jpeg">
              JPG
            </option>

            <option value="image/png">
              PNG
            </option>

          </select>

        </div>

      </div>


      <button class="action-button" id="runTool">
        Compress & Download
      </button>

    `;

  }


  if (type === "convert"){

    controls.innerHTML = `

      <div class="controls">

        <div class="control">

          <label>
            Output format
          </label>

          <select id="format">

            <option value="image/webp">
              WEBP
            </option>

            <option value="image/jpeg">
              JPG
            </option>

            <option value="image/png">
              PNG
            </option>

          </select>

        </div>

      </div>

      <button class="action-button" id="runTool">
        Convert & Download
      </button>

    `;

  }


  if (type === "metadata"){

    controls.innerHTML = `

      <div class="controls">

        <div class="control">

          <label>
            Output format
          </label>

          <select id="format">

            <option value="image/png">
              PNG
            </option>

            <option value="image/jpeg">
              JPG
            </option>

            <option value="image/webp">
              WEBP
            </option>

          </select>

        </div>

      </div>

      <button class="action-button" id="runTool">
        Clean & Download
      </button>

    `;

  }


  if (type === "pdf"){

    controls.innerHTML = `

      <div class="controls">

        <div class="control">

          <label>
            Page size
          </label>

          <select id="pageSize">

            <option value="A4">
              A4
            </option>

            <option value="LETTER">
              Letter
            </option>

          </select>

        </div>


        <div class="control">

          <label>
            Image quality
            <span id="qualityValue">85%</span>
          </label>

          <input
            id="quality"
            type="range"
            min="40"
            max="100"
            value="85"
          >

        </div>

      </div>

      <div id="pdfPreview"></div>

      <button class="action-button" id="runTool">
        Create PDF
      </button>

    `;

  }


  if (type === "colors"){

    controls.innerHTML = `

      <button class="action-button" id="runTool">
        Extract Colors
      </button>

    `;

  }


  if (type === "split"){

    controls.innerHTML = `

      <div class="controls">

        <div class="control">

          <label>
            Grid
          </label>

          <select id="grid">

            <option value="2">
              2 × 2
            </option>

            <option value="3">
              3 × 3
            </option>

            <option value="4">
              4 × 4
            </option>

          </select>

        </div>

      </div>

      <button class="action-button" id="runTool">
        Split & Download
      </button>

    `;

  }


  if (type === "ratio"){

    controls.innerHTML = `

      <div class="controls">

        <div class="control">

          <label>
            Crop ratio
          </label>

          <select id="ratio">

            <option value="1/1">
              1:1
            </option>

            <option value="4/5">
              4:5
            </option>

            <option value="16/9">
              16:9
            </option>

            <option value="9/16">
              9:16
            </option>

            <option value="3/2">
              3:2
            </option>

          </select>

        </div>

      </div>

      <button class="action-button" id="runTool">
        Crop Image
      </button>

    `;

  }


  if (type === "stitch"){

    controls.innerHTML = `

      <div class="controls">

        <div class="control">

          <label>
            Direction
          </label>

          <select id="direction">

            <option value="vertical">
              Vertical
            </option>

            <option value="horizontal">
              Horizontal
            </option>

          </select>

        </div>

      </div>

      <button class="action-button" id="runTool">
        Stitch Images
      </button>

    `;

  }


  const quality = document.getElementById("quality");

  if (quality){

    quality.addEventListener("input", () => {

      document.getElementById("qualityValue").textContent =
        quality.value + "%";

    });

  }


  document
    .getElementById("runTool")
    .addEventListener("click", () => runTool(type));


  if (type === "pdf"){

    renderPDFPreview();

  }

}


/* =========================
   PDF PREVIEW
========================= */

function renderPDFPreview(){

  const box = document.getElementById("pdfPreview");

  if (!box) return;

  if (selectedFiles.length === 0){

    box.innerHTML = "";

    return;

  }


  box.innerHTML = `

    <div class="pdf-list">

      ${selectedFiles.map((file,index) => {

        const url = URL.createObjectURL(file);

        return `

          <div class="pdf-item">

            <img src="${url}">

            <span>
              ${index + 1}. ${escapeHTML(file.name)}
            </span>

          </div>

        `;

      }).join("")}

    </div>

  `;

}


/* =========================
   RUN TOOL
========================= */

async function runTool(type){

  try{

    if (type === "compress"){

      if (!requireFiles(1)) return;

      const image = await loadImage(selectedFiles[0]);

      const format =
        document.getElementById("format").value;

      const quality =
        Number(document.getElementById("quality").value) / 100;

      const canvas =
        canvasFromImage(image);

      canvas.toBlob(blob => {

        if (!blob){

          showToast("Compression failed.");

          return;

        }

        downloadBlob(
          blob,
          `compressed-${Date.now()}.${getExtension(format)}`
        );

        showToast("Compressed image downloaded.");

      },format,quality);

      return;

    }


    if (type === "convert"){

      if (!requireFiles(1)) return;

      const image =
        await loadImage(selectedFiles[0]);

      const format =
        document.getElementById("format").value;

      const canvas =
        canvasFromImage(image);

      canvas.toBlob(blob => {

        downloadBlob(
          blob,
          `converted-${Date.now()}.${getExtension(format)}`
        );

        showToast("Image converted.");

      },format,.92);

      return;

    }


    if (type === "metadata"){

      if (!requireFiles(1)) return;

      const image =
        await loadImage(selectedFiles[0]);

      const format =
        document.getElementById("format").value;

      const canvas =
        canvasFromImage(image);

      /*
        Drawing the image onto a fresh canvas and
        exporting it creates a new file without
        carrying the original EXIF metadata.
      */

      canvas.toBlob(blob => {

        downloadBlob(
          blob,
          `clean-image-${Date.now()}.${getExtension(format)}`
        );

        showToast("Clean image downloaded.");

      },format,.95);

      return;

    }


    if (type === "colors"){

      if (!requireFiles(1)) return;

      await extractColors();

      return;

    }


    if (type === "split"){

      if (!requireFiles(1)) return;

      await splitImage();

      return;

    }


    if (type === "ratio"){

      if (!requireFiles(1)) return;

      await cropRatio();

      return;

    }


    if (type === "stitch"){

      if (!requireFiles(2)) return;

      await stitchImages();

      return;

    }


    if (type === "pdf"){

      if (!requireFiles(1)) return;

      await createPDF();

      return;

    }

  }

  catch(error){

    console.error(error);

    showToast(
      "Something went wrong. Try another image."
    );

  }

}


/* =========================
   REQUIRE FILES
========================= */

function requireFiles(count){

  if (selectedFiles.length < count){

    showToast(
      count === 1
        ? "Please select an image first."
        : `Please select at least ${count} images.`
    );

    return false;

  }

  return true;

}


/* =========================
   LOAD IMAGE
========================= */

function loadImage(file){

  return new Promise((resolve,reject) => {

    const image = new Image();

    const url = URL.createObjectURL(file);

    image.onload = () => {

      URL.revokeObjectURL(url);

      resolve(image);

    };

    image.onerror = reject;

    image.src = url;

  });

}


/* =========================
   CANVAS
========================= */

function canvasFromImage(
  image,
  width = image.naturalWidth,
  height = image.naturalHeight
){

  const canvas =
    document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const ctx =
    canvas.getContext("2d");

  ctx.drawImage(
    image,
    0,
    0,
    width,
    height
  );

  return canvas;

}


/* =========================
   COLOR EXTRACTOR
========================= */

async function extractColors(){

  const image =
    await loadImage(selectedFiles[0]);

  const canvas =
    document.createElement("canvas");

  const width = 120;

  const height =
    Math.max(
      1,
      Math.round(
        width *
        image.naturalHeight /
        image.naturalWidth
      )
    );

  canvas.width = width;
  canvas.height = height;

  const ctx =
    canvas.getContext("2d");

  ctx.drawImage(
    image,
    0,
    0,
    width,
    height
  );

  const data =
    ctx.getImageData(
      0,
      0,
      width,
      height
    ).data;

  const colors = new Map();

  for (
    let i = 0;
    i < data.length;
    i += 20
  ){

    const r =
      Math.min(
        255,
        Math.round(data[i] / 32) * 32
      );

    const g =
      Math.min(
        255,
        Math.round(data[i + 1] / 32) * 32
      );

    const b =
      Math.min(
        255,
        Math.round(data[i + 2] / 32) * 32
      );

    const key =
      `${r},${g},${b}`;

    colors.set(
      key,
      (colors.get(key) || 0) + 1
    );

  }


  const topColors =
    [...colors.entries()]
      .sort((a,b) => b[1] - a[1])
      .slice(0,8);


  const result =
    document.getElementById("toolResult");

  result.innerHTML = `

    <div class="result">

      <div class="palette">

        ${topColors.map(([rgb]) => {

          const values =
            rgb.split(",").map(Number);

          const r = values[0];
          const g = values[1];
          const b = values[2];

          const hex =
            "#" +
            [r,g,b]
              .map(
                value =>
                  value
                    .toString(16)
                    .padStart(2,"0")
              )
              .join("")
              .toUpperCase();

          return `

            <button
              class="swatch"
              style="background:rgb(${r},${g},${b})"
              data-color="${hex}"
            >
              ${hex}
            </button>

          `;

        }).join("")}

      </div>

      <div class="result-info">
        Tap any color to copy its HEX code.
      </div>

    </div>

  `;


  result
    .querySelectorAll(".swatch")
    .forEach(button => {

      button.addEventListener(
        "click",
        async () => {

          try{

            await navigator.clipboard.writeText(
              button.dataset.color
            );

            showToast("HEX copied.");

          }

          catch{

            showToast(
              button.dataset.color
            );

          }

        }
      );

    });

}


/* =========================
   IMAGE SPLITTER
========================= */

async function splitImage(){

  const image =
    await loadImage(selectedFiles[0]);

  const grid =
    Number(
      document.getElementById("grid").value
    );

  const tileWidth =
    Math.ceil(
      image.naturalWidth / grid
    );

  const tileHeight =
    Math.ceil(
      image.naturalHeight / grid
    );


  let count = 0;


  for (let y = 0; y < grid; y++){

    for (let x = 0; x < grid; x++){

      const canvas =
        document.createElement("canvas");

      canvas.width = tileWidth;
      canvas.height = tileHeight;

      const ctx =
        canvas.getContext("2d");

      ctx.drawImage(
        image,

        x * tileWidth,
        y * tileHeight,

        tileWidth,
        tileHeight,

        0,
        0,

        tileWidth,
        tileHeight
      );


      await canvasToBlob(
        canvas,
        "image/png"
      ).then(blob => {

        downloadBlob(
          blob,
          `tile-${y + 1}-${x + 1}.png`
        );

      });


      count++;

    }

  }


  document.getElementById("toolResult").innerHTML = `

    <div class="result">

      <b style="font-size:10px">
        ✓ ${count} tiles downloaded
      </b>

    </div>

  `;

  showToast("All tiles downloaded.");

}


/* =========================
   ASPECT RATIO
========================= */

async function cropRatio(){

  const image =
    await loadImage(selectedFiles[0]);

  const value =
    document.getElementById("ratio").value;

  const parts =
    value.split("/").map(Number);

  const targetRatio =
    parts[0] / parts[1];

  const sourceRatio =
    image.naturalWidth /
    image.naturalHeight;


  let width =
    image.naturalWidth;

  let height =
    image.naturalHeight;


  if (sourceRatio > targetRatio){

    width =
      Math.round(
        height * targetRatio
      );

  }

  else{

    height =
      Math.round(
        width / targetRatio
      );

  }


  const sourceX =
    Math.floor(
      (image.naturalWidth - width) / 2
    );

  const sourceY =
    Math.floor(
      (image.naturalHeight - height) / 2
    );


  const canvas =
    document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;


  const ctx =
    canvas.getContext("2d");


  ctx.drawImage(

    image,

    sourceX,
    sourceY,
    width,
    height,

    0,
    0,
    width,
    height

  );


  showCanvasResult(
    canvas,
    "cropped-image.png"
  );

}


/* =========================
   STITCH
========================= */

async function stitchImages(){

  const images =
    await Promise.all(
      selectedFiles.map(loadImage)
    );

  const vertical =
    document.getElementById("direction").value
    === "vertical";


  let width;
  let height;


  if (vertical){

    width =
      Math.max(
        ...images.map(
          image => image.naturalWidth
        )
      );

    height =
      images.reduce(
        (sum,image) =>
          sum + image.naturalHeight,
        0
      );

  }

  else{

    width =
      images.reduce(
        (sum,image) =>
          sum + image.naturalWidth,
        0
      );

    height =
      Math.max(
        ...images.map(
          image => image.naturalHeight
        )
      );

  }


  const canvas =
    document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;


  const ctx =
    canvas.getContext("2d");


  let position = 0;


  images.forEach(image => {

    if (vertical){

      const x =
        (width - image.naturalWidth) / 2;

      ctx.drawImage(
        image,
        x,
        position
      );

      position += image.naturalHeight;

    }

    else{

      const y =
        (height - image.naturalHeight) / 2;

      ctx.drawImage(
        image,
        position,
        y
      );

      position += image.naturalWidth;

    }

  });


  showCanvasResult(
    canvas,
    "stitched-image.png"
  );

}


/* =========================
   SHOW CANVAS RESULT
========================= */

function showCanvasResult(canvas,name){

  const result =
    document.getElementById("toolResult");

  result.innerHTML = "";

  const box =
    document.createElement("div");

  box.className = "result";


  box.appendChild(canvas);


  const button =
    document.createElement("button");

  button.className =
    "action-button";

  button.textContent =
    "Download Result";


  button.addEventListener(
    "click",
    () => {

      canvasToBlob(
        canvas,
        "image/png"
      ).then(blob => {

        downloadBlob(
          blob,
          name
        );

        showToast(
          "Result downloaded."
        );

      });

    }
  );


  box.appendChild(button);

  result.appendChild(box);

}


/* =========================
   PDF GENERATOR
========================= */

async function createPDF(){

  const images =
    await Promise.all(
      selectedFiles.map(loadImage)
    );


  const pageSize =
    document.getElementById("pageSize").value;

  const quality =
    Number(
      document.getElementById("quality").value
    ) / 100;


  let pageWidth;
  let pageHeight;


  /*
    PDF dimensions are points.
  */

  if (pageSize === "A4"){

    pageWidth = 595.28;
    pageHeight = 841.89;

  }

  else{

    pageWidth = 612;
    pageHeight = 792;

  }


  const margin = 28;


  const pages = [];


  for (const image of images){

    const maxWidth =
      pageWidth - margin * 2;

    const maxHeight =
      pageHeight - margin * 2;


    const scale =
      Math.min(
        maxWidth / image.naturalWidth,
        maxHeight / image.naturalHeight
      );


    const width =
      Math.max(
        1,
        Math.round(
          image.naturalWidth * scale
        )
      );


    const height =
      Math.max(
        1,
        Math.round(
          image.naturalHeight * scale
        )
      );


    const canvas =
      document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;


    const ctx =
      canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
      0,
      0,
      width,
      height
    );

    ctx.drawImage(
      image,
      0,
      0,
      width,
      height
    );


    const jpegData =
      await canvasToJPEGBytes(
        canvas,
        quality
      );


    pages.push({
      width,
      height,
      data:jpegData
    });

  }


  const pdfBlob =
    buildPDF(
      pages,
      pageWidth,
      pageHeight,
      margin
    );


  downloadBlob(
    pdfBlob,
    "images.pdf"
  );


  document.getElementById("toolResult").innerHTML = `

    <div class="result">

      <b style="font-size:11px">
        ✓ PDF created successfully
      </b>

      <div class="result-info">
        ${pages.length}
        page${pages.length > 1 ? "s" : ""}
        • ${pageSize}
      </div>

    </div>

  `;


  showToast("PDF downloaded.");

}


/* =========================
   JPEG BYTES
========================= */

function canvasToJPEGBytes(
  canvas,
  quality
){

  return new Promise(resolve => {

    canvas.toBlob(blob => {

      const reader =
        new FileReader();

      reader.onload = () => {

        resolve(
          new Uint8Array(
            reader.result
          )
        );

      };

      reader.readAsArrayBuffer(blob);

    },"image/jpeg",quality);

  });

}


/* =========================
   PDF BUILDER
========================= */

function buildPDF(
  pages,
  pageWidth,
  pageHeight,
  margin
){

  const encoder =
    new TextEncoder();


  const objects = new Map();


  /*
    Object numbers:
    
    1 Catalog
    2 Pages
    3 Info
    then image/page objects
  */

  objects.set(
    1,
    "<< /Type /Catalog /Pages 2 0 R >>"
  );


  const pageObjectStart =
    4 + pages.length * 2;


  const pageObjects =
    pages.map(
      (_,index) =>
        pageObjectStart + index
    );


  objects.set(
    2,
    `<< /Type /Pages /Kids [${pageObjects
      .map(number => `${number} 0 R`)
      .join(" ")}] /Count ${pages.length} >>`
  );


  objects.set(
    3,
    "<< /Producer (ImageToolbox V1) >>"
  );


  pages.forEach((page,index) => {

    const imageObject =
      4 + index * 2;

    const contentObject =
      imageObject + 1;

    const pageObject =
      pageObjectStart + index;


    objects.set(
      imageObject,
      {
        header:
          `<<
            /Type /XObject
            /Subtype /Image
            /Width ${page.width}
            /Height ${page.height}
            /ColorSpace /DeviceRGB
            /BitsPerComponent 8
            /Filter /DCTDecode
            /Length ${page.data.length}
          >>`,

        stream:
          page.data
      }
    );


    const contentText =
      `q
${page.width} 0 0 ${page.height} ${margin} ${pageHeight - margin - page.height} cm
/Im${index} Do
Q`;


    const contentBytes =
      encoder.encode(contentText);


    objects.set(
      contentObject,
      {
        header:
          `<< /Length ${contentBytes.length} >>`,

        stream:
          contentBytes
      }
    );


    objects.set(
      pageObject,
      `<<
        /Type /Page
        /Parent 2 0 R
        /MediaBox [0 0 ${pageWidth} ${pageHeight}]
        /Resources <<
          /XObject <<
            /Im${index} ${imageObject} 0 R
          >>
        >>
        /Contents ${contentObject} 0 R
      >>`
    );

  });


  const chunks = [];

  let position = 0;


  const header =
    encoder.encode(
      "%PDF-1.4\n"
    );


  chunks.push(header);

  position += header.length;


  const maxObject =
    pageObjectStart + pages.length - 1;


  const offsets =
    new Array(maxObject + 1)
      .fill(0);


  for (
    let number = 1;
    number <= maxObject;
    number++
  ){

    const object =
      objects.get(number);


    offsets[number] =
      position;


    if (
      typeof object === "string"
    ){

      const bytes =
        encoder.encode(
          `${number} 0 obj
${object}
endobj
`
        );


      chunks.push(bytes);

      position += bytes.length;

    }

    else{

      const headerBytes =
        encoder.encode(
          `${number} 0 obj
${object.header}
stream
`
        );


      const footerBytes =
        encoder.encode(
          `
endstream
endobj
`
        );


      chunks.push(
        headerBytes,
        object.stream,
        footerBytes
      );


      position +=
        headerBytes.length +
        object.stream.length +
        footerBytes.length;

    }

  }


  const xrefPosition =
    position;


  let xref =
    `xref
0 ${maxObject + 1}
0000000000 65535 f 
`;


  for (
    let number = 1;
    number <= maxObject;
    number++
  ){

    xref +=
      String(
        offsets[number]
      ).padStart(10,"0") +
      " 00000 n \n";

  }


  xref +=
    `trailer
<<
  /Size ${maxObject + 1}
  /Root 1 0 R
>>
startxref
${xrefPosition}
%%EOF`;


  chunks.push(
    encoder.encode(xref)
  );


  return new Blob(
    chunks,
    {
      type:"application/pdf"
    }
  );

}


/* =========================
   CANVAS TO BLOB
========================= */

function canvasToBlob(
  canvas,
  type
){

  return new Promise(resolve => {

    canvas.toBlob(
      resolve,
      type,
      .95
    );

  });

}


/* =========================
   DOWNLOAD
========================= */

function downloadBlob(
  blob,
  filename
){

  if (!blob){

    showToast(
      "Could not create file."
    );

    return;

  }


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  link.remove();


  setTimeout(() => {

    URL.revokeObjectURL(url);

  },1500);

}


/* =========================
   EXTENSION
========================= */

function getExtension(format){

  if (
    format === "image/jpeg"
  ){

    return "jpg";

  }

  if (
    format === "image/png"
  ){

    return "png";

  }

  return "webp";

}


/* =========================
   TOAST
========================= */

function showToast(message){

  toast.textContent =
    message;

  toast.classList.add("show");


  clearTimeout(
    window.toastTimer
  );


  window.toastTimer =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    },2200);

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text){

  return text.replace(
    /[&<>"']/g,
    char => {

      const map = {

        "&":"&amp;",
        "<":"&lt;",
        ">":"&gt;",
        '"':"&quot;",
        "'":"&#039;"

      };

      return map[char];

    }
  );

}