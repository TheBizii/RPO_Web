function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("body").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("body").style.marginLeft = "0";
}

//user info
document.getElementById("uinfoopen").onclick = function() {
  console.log("im here user");
  document.getElementById("uinfo-modal").style.display = "block";
}

document.getElementById("closemu").onclick = function() {
  console.log("closebybutton user");
  document.getElementById("uinfo-modal").style.display = "none";
}

window.onclick = function(event) {
  if (event.target == document.getElementById("uinfo-modal")) {
    console.log("close user");
    document.getElementById("uinfo-modal").style.display = "none";
  }
  else if (event.target == document.getElementById("pinfo-modal")) {
    console.log("close paying");
    document.getElementById("pinfo-modal").style.display = "none";
  }
  else if (event.target == document.getElementById("linfo-modal")) {
      console.log("close location");
      document.getElementById("linfo-modal").style.display = "none";
  }
  else if (event.target == document.getElementById("pmode-modal")) {
    console.log("close mode");
    document.getElementById("pmode-modal").style.display = "none";
  }
}

//paying iinfo
document.getElementById("pinfoopen").onclick = function() {
  console.log("im here paying");
  document.getElementById("pinfo-modal").style.display = "block";
}

document.getElementById("closemp").onclick = function() {
  console.log("closebybutton paying");
  document.getElementById("pinfo-modal").style.display = "none";
}

//location info
document.getElementById("linfoopen").onclick = function() {
  console.log("im here location");
  document.getElementById("linfo-modal").style.display = "block";
}

document.getElementById("closeml").onclick = function() {
  console.log("closebybutton location");
  document.getElementById("linfo-modal").style.display = "none";
}

//account mode
document.getElementById("pmodeopen").onclick = function() {
  console.log("im here mode");
  document.getElementById("pmode-modal").style.display = "block";
}

document.getElementById("closempmode").onclick = function() {
  console.log("closebybutton mode");
  document.getElementById("pmode-modal").style.display = "none";
}


// function(){
//   $(".set-box-uinfo").on("click", function(){
//
//     $(".modal-mask").css("display", "block");
//     $(".modal-popup").css("display", "block");
//
//     // $(".modal-popup").animate({
//     //    'width' : '80%',
//     //    'left' : '10%'
//     //    }, 200, "swing" , function(){
//     //    $(".modal-popup").animate({
//     //       'height' : '80%',
//     //       'top' : '10%'
//     //    }, 200, "swing", function(){});
//     //   });
//     }
//
//   $(document).on("keydown", function(event){
//    if(event.keyCode === 27){
//     $(".modal-mask").css("display", "");
//        $(".modal-popup").css({
//            "display": "",
//            "width": "",
//            "height": "",
//            "top": "",
//            "left": ""
//        });
//     }
//   });
// });
