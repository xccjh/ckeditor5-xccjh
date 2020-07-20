# CKEditor 5 editor Extend

extend support video fileUpload
扩展CKEditor5支持本地视频文件上传功能，图片/视频oss直传

# Usage
## browser
```html
<div class="editor"></div>
```
```javascript
// <script src="https://cdn.staticfile.org/jquery/3.5.1/jquery.js"></script>
// <script src="https://unpkg.com/@reactivex/rxjs@5.0.0-beta.7/dist/global/Rx.umd.js"></script>
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

ClassicEditor.create(document.querySelector('.editor'), {
    videoUpload: (file) => {
        return new Rx.Observable((nextObserve) => {
            const formData = new FormData();
            formData.append("file", file);
            const test = aj("http://127.0.0.1:8080/upload", "POST", "json", formData);
            test.subscribe((res) => {
                        nextObserve.next({url: "http://127.0.0.1:8080/" + res.url});
                    }, error => {
                        nextObserve.error(res)
                    },
                    () => {
                    })
        });
    },
     imageUpload: (file) => {
            return new Rx.Observable((nextObserve) => {
                const formData = new FormData();
                formData.append("file", file);
                const test = aj("http://127.0.0.1:8080/upload", "POST", "json", formData);
                test.subscribe((res) => {
                            nextObserve.next({url: "http://127.0.0.1:8080/" + res.url});
                        }, error => {
                            nextObserve.error(res)
                        },
                        () => {
                        })
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
}).then(editor => {
            window.editor = editor;
        }).catch(error => {
        });
```
## angular
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
import '@ckeditor/ckeditor5-build-classic/build/translations/zh';
// import { myCustomUploadAdapterPlugin } from './custom-upload-adapter-plugin';
const ClassicEditor = import('@xccjh/xccjh-ckeditor5-video-file-upload');


export class Test implements OnInit{
  public Editor = ClassicEditor;
  public defineYourself = ""
  public defineYourselfFrom!: FormGroup;
  public config = {
      videoUpload: (file) => {
        return new Observable<any>((observe) => {
          const success = (url) => {
            if (url) {
              observe.next({ url: environment.OSS_URL + url });
            } else {
              this.message.warning('上传失败');
            }
          };
          const error = (res) => {
            this.message.warning('上传失败');
          };
  
          this.uploadOssService
            .uploadOss(file, UploadDir.editor)
            .subscribe(success, error);
        });
      },
    imageUpload: (file) => {
       return new Observable<any>((observe) => {
                const success = (url) => {
                  if (url) {
                    observe.next({ url: environment.OSS_URL + url });
                  } else {
                    this.message.warning('上传失败');
                  }
                };
                const error = (res) => {
                  this.message.warning('上传失败');
                };
        
                this.uploadOssService
                  .uploadOss(file, UploadDir.editor)
                  .subscribe(success, error);
              });
          },
      mediaEmbed: {
        extraProviders: [
          {
            name: 'zdy',
            url: [/(.*?)/],
            html: (match) => {
              const src = match.input;
              return (
'<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;pointer-events: auto;">' +
'<video controls style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" src="' +
src +
'">' +
'</video>' +
'</div>'
              );
            },
          },
        ],
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
        ],
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
      // ckfinder: {
      //   uploadUrl: environment.SERVER_URL + 'res/oss/file/upload',
      // },
      // extraPlugins: [myCustomUploadAdapterPlugin],
    };
    
     ngOnInit(): void {
            this.defineYourselfFrom = this.fb.group({
              defineYourself: ['', [Validators.required]],
            });
     }
```

