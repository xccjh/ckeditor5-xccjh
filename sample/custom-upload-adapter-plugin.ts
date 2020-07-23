export class MyUploadAdapter {
  private loader: any;
  private xhr: any;

  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        })
    );
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());
    xhr.open('POST', 'http://101.200.195.31:9900/res/oss/file/upload', true);
    xhr.responseType = 'json';
    // xhr.setRequestHeader('Authorization', 'test'); // 设置请求头
  }

  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `不能上传文件: ${file.name}.`;

    xhr.addEventListener('error', () => reject(genericErrorText));
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const response = xhr.response;
      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        );
      }
      resolve({
        default: response.url,
      });
    });
    if (xhr.upload) {
      xhr.upload.addEventListener('progress', (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  _sendRequest(file) {
    const data = new FormData();
    data.append('upload', file);
    this.xhr.send(data);
  }
}

export function myCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}
