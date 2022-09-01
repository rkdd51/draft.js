import Component from "./Component";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import html2canvas from "html2canvas";
import jsPdf from "jspdf";
import { useState } from "react";
const DraftComponent = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (editorState) => {
    return setEditorState(editorState);
  };
  const printPDF = () => {
    const domElement = document.getElementById("pdf");
    // const domElement = draftToHtml(
    //   convertToRaw(editorState.getCurrentContent())
    // );
    console.log(domElement, "Dom");
    html2canvas(domElement, {
      onclone: (document) => {
        document.getElementById("print").style.display = "none";
      }
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPdf();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${new Date().toISOString()}.pdf`);
    });
  };

  return (
    <>
      <div id="pdf">
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={onEditorStateChange}
          toolbar={{
            options: ["inline", "list"]
          }}
        />
      </div>
      {/* {console.log(
        "editorState => ",
        draftToHtml(convertToRaw(editorState.getCurrentContent()))
      )} */}
      <button id="print" onClick={printPDF}>
        Download PDF
      </button>
    </>
  );
};
export default DraftComponent;
