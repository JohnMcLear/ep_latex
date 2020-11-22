var root = '../..';

/* the below 3 lines break stuff */
/*
$.runScript(root+'texlive/website/pdftex.js/release/pdftex-webworker.js');
$.runScript(root+'texlive/website/pdftex.js/release/pdftex.js');
$.runScript(root+'texlive/website/texlive.js');
*/

exports.documentReady = function (hook, context) {
  const button = $('#compileLatex');
  let mode = 'compile';

  let pdf;
  button.click(() => {
    if (mode === 'compile') {
      button.append('<div id="msg">compiling</div>');

      const pdftex = new PDFTeX();

      pdftex.on_stdout = function (txt) { };
      pdftex.on_stderr = function (txt) { };

      const texlive = new TeXLive(pdftex);

      const url = `${document.URL}/export/txt`;
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);

      xhr.onreadystatechange = function (ev) {
        const code = ev.responseText;
        texlive.compile(code, root, (data) => {
          button.find('#msg').text('click to open');
          pdf = data;
          mode = 'open';
        });
      };

      xhr.send(null);
    } else {
      mode = 'compile';
      window.open(`data:application/pdf;base64,${window.btoa(pdf)}`);
    }
  });
};
