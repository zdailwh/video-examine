// self.addEventListener("message", e => {
//   console.log(e.data)
//   // var copyList = e.data
//   // var fso = new ActiveXObject('Scripting.FileSystemObject')
//   // copyList.forEach((item, idx, arr) => {
//   //   // this.$set(this.list[index], 'copystatus', 'coping')
//   //   console.log(item.source + '---' + item.destination)
//   //   fso.CopyFile(item.source, item.destination, false)
//   // })
//   postMessage('worker发送消息啦~')
// })

// var i=0;

// function timedCount()
// {
//     i=i+1;
//     if (i === 30) {
//       postMessage('结束');
//     } else {
//       postMessage(i);
//       setTimeout("timedCount()",500);
//   }
// }

// timedCount();

// var fso = new ActiveXObject('Scripting.FileSystemObject')
// importScripts('./sub.js')
onmessage = function(e) {
  var copyList = e.data.list
  var fso = JSON.parse(e.data.fso)
  copyList.forEach(function(item, idx, arr) {
    // this.$set(this.list[index], 'copystatus', 'coping')
    console.log(item.source + '---' + item.destination)
    fso.CopyFile(item.source, item.destination, false)
  })
  postMessage('worker发送消息啦~')
}