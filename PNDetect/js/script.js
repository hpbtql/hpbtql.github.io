const CLASSES = ["结果: 您热情似火","结果: 您坚硬如松","发生未知错误"];
const MODEL_PATH = 'model/model.json';

function file2img(file) {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = e => {
            const img = document.getElementById('preview');
            document.getElementById('imgShow').src = e.target.result;
            img.src = e.target.result;
            img.width = 224;
            img.height = 224;
            img.onload = () => resolve(img);
        }
    })
}

window.onload = async() => {
    document.getElementById('condition').innerHTML = '页面加载中请耐心等待';
    const model = await tf.loadLayersModel(MODEL_PATH);
    document.getElementById('formFile').disabled = ''
    document.getElementById('condition').innerHTML = '';
    window.predict = async(file) => {
        document.getElementById('tip').innerHTML = '少女祈祷中';
        const img = await file2img(file);

        // pre-process
        const pred = tf.tidy(() => {
            const input = tf.browser.fromPixels(img)
                .toFloat()
                .sub(255 / 2)
                .div(255 / 2)
                .reshape([1, 224, 224, 3]);
            res = model.predict(input);
            return res;
        })
        const index = pred.argMax(1).dataSync()[0]

        // show result
        document.getElementById('tip').innerHTML = '测试完成。您可以再次选择图片进行预测';
        document.getElementById('output').innerHTML = `${CLASSES[index]}`;
    }
}