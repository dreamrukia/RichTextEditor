import React from 'react';
// Import TinyMce
import 'tinymce';

// Default Icons
import 'tinymce/icons/default';

// Theme
import 'tinymce/themes/silver';

// Plugins
import 'tinymce/plugins/image';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/help';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/textcolor';

// CSS
import 'tinymce/skins/ui/oxide/skin.min.css';

import { Editor } from '@tinymce/tinymce-react';
// ------------------------------------------------------------------------------------------------

import { Editor as EditorDraft, EditorState, RichUtils, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';

// ------------------------------------------------------------------------------------------------

import { CKEditor } from '@ckeditor/ckeditor5-react';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      raw: '',
      editor: 'tinyMCE',
      editorState: EditorState.createEmpty(),
      ckeData: ''
    };
  }
  handleEditorChange = (content, editor) => {
    console.log('Content was updated:', content);
    this.setState({ raw: content });
  };

  handleDraftJSChange = editorState => this.setState({ editorState });

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.handleDraftJSChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }
  _onBoldClick() {
    this.handleDraftJSChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  getEditor() {
    switch (this.state.editor) {
      case 'tinyMCE':
        return (
          <>
            <Editor
              initialValue="<p>This is the initial content of the editor</p>"
              init={{
                height: 200,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount textcolor'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic underline backcolor forecolor| \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | help'
              }}
              onEditorChange={this.handleEditorChange}
            />
            <div>
              Raw text: <br />
              {this.state.raw}
            </div>
          </>
        );
      case 'DraftJS':
        return (
          <>
            <div>
              <button onClick={this._onBoldClick.bind(this)}>Bold</button>
            </div>
            <div style={{ height: '300px' }}>
              <EditorDraft
                editorState={this.state.editorState}
                onChange={this.handleDraftJSChange}
              />
            </div>

            <div>
              Raw text: <br />
              {JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()))}
            </div>
          </>
        );
      case 'CKEditor':
        return (
          <>
            <CKEditor
              editor={ClassicEditor}
              data="<p>Hello from CKEditor 5!</p>"
              onReady={editor => {
                // You can store the "editor" and use when it is needed.
                console.log('Editor is ready to use!', editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                this.setState({ ckeData: data });
                console.log({ event, editor, data });
              }}
              onBlur={(event, editor) => {
                console.log('Blur.', editor);
              }}
              onFocus={(event, editor) => {
                console.log('Focus.', editor);
              }}
            />
            <div>
              Raw text: <br />
              {this.state.ckeData}
            </div>
          </>
        );
    }
  }

  render() {
    return (
      <>
        {this.getEditor()}
        <div style={{ bottom: 0, position: 'absolute' }}>
          <button onClick={() => this.setState({ editor: 'tinyMCE' })}>TinyMCE</button>
          <button onClick={() => this.setState({ editor: 'DraftJS' })}>DraftJS</button>
          <button onClick={() => this.setState({ editor: 'CKEditor' })}>CKEditor</button>
        </div>
      </>
    );
  }
}

export default App;
