# CKEditor 5 editor Extend
![](https://xccjhzjh.oss-cn-hongkong.aliyuncs.com/xccjh-images/ckeditor5.gif)
extend support video fileUpload
扩展CKEditor5支持本地视频文件上传功能，图片/视频oss直传,兼容vue，angular，react

# dev package environment
## server side

![开启本地测试环境'](https://xccjhzjh.oss-cn-hongkong.aliyuncs.com/xccjh-images/Snipaste_2020-07-21_11-40-24.png)

开启本地测试环境


## build package
npm run build

# Package Usage
## config
以下不同框架环境config采用以下配置,全开经典,支持自由配置
```js
const CONFIG= 
{
videoUpload: (file) => {
 return new Promise((resolve, reject) => {
   const formData = new FormData();
   formData.append("file", file);
   // aj函数见下面声明
   const test = aj("http://127.0.0.1:8080/upload", "POST", "json", formData);
   test.subscribe((res) => {
           resolve({url: "http://127.0.0.1:8080/" + res.url});
       }, error => {
           reject(res)
       }
   )});
},
imageUpload: (file) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    const test = aj("http://127.0.0.1:8080/upload", "POST", "json", formData);
    test.subscribe((res) => {
            resolve({url: "http://127.0.0.1:8080/" + res.url});
        }, error => {
            reject(res)
        }
    )
});
},
mediaEmbed: {
  extraProviders: [
      {
          name: 'zdy',
          url: [
              /(.*?)/,
          ],
          html: match => {
              const src = match.input;
              return (
'<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;pointer-events: auto;">' +
'<video controls style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" src="' + src + '">' +
'</video>'+
'</div>'
              );
          }
      },
  ]
},
heading: {
  options: [
      { model: 'paragraph', title: '正文', class: 'ck-heading_paragraph' },
      {
          model: 'heading1',
          view: 'h1',
          title: '标题1',
          class: 'ck-heading_heading1',
      },
      {
          model: 'heading2',
          view: 'h2',
          title: '标题2',
          class: 'ck-heading_heading2',
      },
      {
          model: 'heading3',
          view: 'h3',
          title: '标题3',
          class: 'ck-heading_heading3',
      },
      {
          model: 'heading4',
          view: 'h4',
          title: '标题4',
          class: 'ck-heading_heading4',
      },
  ],
},
toolbar: {
  items: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'fontBackgroundColor',
      'fontColor',
      'fontSize',
      'fontFamily',
      'link',
      'insertTable',
      'imageUpload',
      'mediaEmbed',
      // 'CKFinder',
      'bulletedList',
      'numberedList',
      'removeFormat',
      '|',
      'alignment',
      'indent',
      'outdent',
      '|',
      'blockQuote',
      'undo',
      'redo',
      'code',
      'codeBlock',
      'highlight',
      'exportPdf',
      'specialCharacters',
      'horizontalLine',
      'MathType',
      'ChemType',
      'strikethrough',
      'subscript',
      'superscript',
      'todoList',
      'restrictedEditingException',
  ]
},
alignment: {
  options: ['left', 'center', 'right', 'justify'],
},
language: 'zh-cn',
image: {
  toolbar: [
      'imageTextAlternative',
      '|',
      'imageStyle:alignLeft',
      'imageStyle:full',
      'imageStyle:alignRight',
  ],
  resizeUnit: 'px',
  types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'],
  styles: ['full', 'alignLeft', 'alignRight'],
},
table: {
  contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellProperties',
      'tableProperties',
  ],
},
tableProperties: {
  // ...
},

tableCellProperties: {
  // ...
},
fontFamily: {
  options: [
      'default',
      'Arial, Helvetica, sans-serif',
      'Courier New, Courier, monospace',
      'Georgia, serif',
      'Lucida Sans Unicode, Lucida Grande, sans-serif',
      'Tahoma, Geneva, sans-serif',
      'Times New Roman, Times, serif',
      'Trebuchet MS, Helvetica, sans-serif',
      'Verdana, Geneva, sans-serif',
  ],
},
licenseKey: '',
}
```

## browser
```html
<div class="editor"></div>
```
```javascript
// <script src="https://cdn.staticfile.org/jquery/3.5.1/jquery.js"></script>
// <script src="https://unpkg.com/@reactivex/rxjs@5.0.0-beta.7/dist/global/Rx.umd.js"></script>// 非必须
// <script src='./build/ckeditor.js'></script>
 function aj(url, type = "POST", dataType = "json", data) {
    return Rx.Observable.fromPromise(
            $.ajax({
                url,
                dataType,
                type,
                async: false,
                data,
                processData: false, // 使数据不做处理
                contentType: false, // 不要设置Content-Type请求头
            }).promise()
    );
}

ClassicEditor.create(document.querySelector('.editor'),CONFIG ).then(editor => {
    window.editor = editor;
}).catch(error => {
});
```
## angular

### 记得安装angular设配器
#### 步骤一装包
```sh
npm install --save @ckeditor/ckeditor5-angular @xccjh/xccjh-ckeditor5-video-file-upload
```
#### 步骤二导包
```ts
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// 在你用编辑器的模块import
@NgModule( {
    imports: [
        CKEditorModule,
        // ...
    ],
    // ...
} )
```
#### 步骤三用包
```html
  <ckeditor [editor]="Editor" [(ngModel)]="defineYourselfFrom" placeholder="请输入文章内容"
                        [config]="config" [id]='"editor"' formControlName='defineYourself' ></ckeditor>
```
```ts
import {
  Component,
  OnInit,
  ViewChildren,
  AfterViewInit,
  QueryList,
  Renderer2,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormArray,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadOssService } from 'core/services/upload-oss.service';
import { environment } from '../../../../../../../environments-common/environment';
import { UploadDir } from '../../../../../../../core/utils/uploadDir';
==========================================================================
const ClassicEditor = import('@xccjh/xccjh-ckeditor5-video-file-upload');// 这里
==========================================================================

@Component({
  selector: 'app-article-add',
  templateUrl: './article-add.component.html',
  styleUrls: ['./article-add.component.less'],
  providers: [UploadOssService, OfficalManageService],
})
export class Test implements OnInit{
  public Editor = ClassicEditor;
  public defineYourself = ""
  public defineYourselfFrom!: FormGroup;
  ========================================================================== // 重点
  public config = CONFIG;
  ==========================================================================
     ngOnInit(): void {
            this.defineYourselfFrom = this.fb.group({
              defineYourself: ['', [Validators.required]],
            });
     }
```
## react
### 记得安装react设配器
#### 步骤一装包
```sh
npm install --save @ckeditor/ckeditor5-react @xccjh/xccjh-ckeditor5-video-file-upload
```
#### 步骤二导包用包
```jsx 
// 这里使用axios+promise方式不用jq+rxjs
CONFIG.imageUpload=CONFIG.videoUpload=(file) => {
 return new Promise((resolve, reject) => {
   const formData = new FormData()
   formData.append('file', file)
   const test = this.uploadFile(formData)
   test.then((res) => {
     resolve({ url: 'http://127.0.0.1:8080/' + res.data.url })
   }
   ).catch((e) => {
     console.log('e', e)
   })
 })
},

import React, { Component } from 'react';
import './App.css';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@xccjh/xccjh-ckeditor5-video-file-upload';
import axios from 'axios'
class App extends Component {
    uploadFile (formData) {
        const config = {
            headers: {
                'Content-Type': 'mutipart/form-data;charset=UTF-8'
            }
        }
        return axios.post('http://127.0.0.1:8081/upload', formData, config)
    }
    config = CONFIG,
    render () {
        return (
            <div className="App" >
                <CKEditor
                    editor={ClassicEditor}
                    data="<p>Hello from CKEditor 5!</p>"
                    onInit={
                        editor => {
                            console.log('Editor is ready to use!', editor);
                        }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        console.log({ event, editor, data });
                    }}
                    onBlur={(event, editor) => {
                        console.log('Blur.', editor);
                    }}
                    onFocus={(event, editor) => {
                        console.log('Focus.', editor);
                    }}
                    config={
                        this.config
                    }
                />
            </div>
        );
    }
}
export default App;
```
## vue
### 记得安装vue设配器
#### 步骤一装包
```sh
npm install --save @ckeditor/ckeditor5-vue @xccjh/xccjh-ckeditor5-video-file-upload
```
#### 步骤二导包
```vue
import Vue from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue'
// 再main.js导入import
Vue.use(CKEditor)
```

#### 步骤三用包
```vue
<tempalte>
  <ckeditor [editor]="Editor" [(ngModel)]="defineYourselfFrom" placeholder="请输入文章内容"
                        [config]="config" [id]='"editor"' formControlName='defineYourself' ></ckeditor>
</tempalte>
<script >
import ClassicEditor from '@xccjh/xccjh-ckeditor5-video-file-upload'
import axios from 'axios'
// 这里使用axios+promise方式不用jq+rxjs
CONFIG.imageUpload=CONFIG.videoUpload=(file) => {
 return new Promise((resolve, reject) => {
   const formData = new FormData()
   formData.append('file', file)
   const test = this.uploadFile(formData)
   test.then((res) => {
     resolve({ url: 'http://127.0.0.1:8080/' + res.data.url })
   }
   ).catch((e) => {
     console.log('e', e)
   })
 })
}

export default {
  name: 'test',
  methods: {
    uploadFile (formData) {
      const config = {
        headers: {
          'Content-Type': 'mutipart/form-data;charset=UTF-8'
        }
      }
      return axios.post('127.0.0.1:8080/upload', formData, config)
    }
  },
  data () {
    return {
      editor: ClassicEditor,
      editorData: '<p>Content of the editor.</p>',
      editorConfig: CONFIG
    }
  }
}
</script>
```


