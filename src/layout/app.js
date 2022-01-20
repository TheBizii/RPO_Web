//header
$(document).ready( function() {
  $('#header').load(localStorage.getItem("header") || "header.html");
  if (window.location.href == "http://localhost/RPO_Web/store.html" || window.location.href == "https://bolt.printeepro.com/store.html") {
    let id = localStorage.getItem("clicked");
    let shops = JSON.parse(localStorage.getItem("shops"));
    let name = shops[id].name;
    document.getElementById("storename").innerHTML = name;
    document.getElementById("storelogo").src = shops[id].image;
  }
  else if (window.location.href == "http://localhost/RPO_Web/index.html" || window.location.href == "https://bolt.printeepro.com/index.html") {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getlocation);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
});

//connection with database
//login
async function submitForm(e) {
 e.preventDefault();
 const username = $("#txt_uname").val().trim();
 const password = $("#txt_pwd").val().trim();
 const msgBuffer = new TextEncoder().encode(password);
 const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
 const hashArray = Array.from(new Uint8Array(hashBuffer));
 const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
 if( username != "" && hashHex.toUpperCase() != "" ){
     $.ajax({
         url:'https://bolt.printeepro.com/API/login',
         type:'post',
         contentType: 'application/json',
         data: JSON.stringify({username:username,password:hashHex.toUpperCase()}),
         success:function(response){
             if(response.message == "OK"){
                 document.getElementById('id01').style.display = "none";
                 document.getElementById('loginb').style.display = "none";
                 document.getElementById('settingsdrop').style.display = "block";
                 localStorage.setItem("name", username);
                 localStorage.setItem("header", "headerLog.html");
             }
         }
     });
   }
 return false;
}

async function getlocation(position) {
  let longitude = position.coords.latitude;
  let latitude = position.coords.longitude;
 if( latitude != "" && longitude != "" ){
     $.ajax({
         url:'https://bolt.printeepro.com/API/nearbyShops',
         type:'post',
         contentType: 'application/json',
         data: JSON.stringify({lat:latitude,lng:longitude}),
         success:function(response){
             if(response.shops != undefined){
             localStorage.setItem("shops", JSON.stringify(response.shops));
               localStorage.setItem("latitude", latitude);
               localStorage.setItem("longitude", longitude);
               //document.getElementById("shop1").src = "./pictures/mac.png";
               let shops = response.shops;
               for (var i = 0; i < 4; i++) {
                 let name = shops[i].name;
                 let image = shops[i].image;
                 let idbox = "shop" + i;
                 let nameshop = "shopname" + i;
                 document.getElementById(idbox).src = "" + image;
                 document.getElementById(idbox).style.width = "400px";
                 document.getElementById(idbox).style.height = "400px";
                 document.getElementById(nameshop).innerHTML = name;
               }
             }
         }
     });
   }
}

// sidebar
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("body").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("body").style.marginLeft = "0";
}

function clearSt() {
  console.log("cleared");
  localStorage.clear();
}

function getShopName(number) {
  localStorage.setItem("clicked", number);
}
//login modal close
window.onclick = function(event) {
  if (event.target == document.getElementById('id01')) {
      document.getElementById('id01').style.display = "none";
  }
}
