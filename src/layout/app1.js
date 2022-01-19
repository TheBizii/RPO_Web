
//user info
document.getElementById("uinfoopen").onclick = function() {
  document.getElementById("uinfo-modal").style.display = "block";
  let name = localStorage.getItem("name");
  document.getElementById("name").innerHTML = name;
}

document.getElementById("closemu").onclick = function() {
  document.getElementById("uinfo-modal").style.display = "none";
}

//paying iinfo
document.getElementById("pinfoopen").onclick = function() {
  document.getElementById("pinfo-modal").style.display = "block";
}

document.getElementById("closemp").onclick = function() {
  document.getElementById("pinfo-modal").style.display = "none";
}

//location info
document.getElementById("linfoopen").onclick = function() {
  document.getElementById("linfo-modal").style.display = "block";
}

document.getElementById("closeml").onclick = function() {
  document.getElementById("linfo-modal").style.display = "none";
}

//account mode
document.getElementById("pmodeopen").onclick = function() {
  document.getElementById("pmode-modal").style.display = "block";
}

document.getElementById("closempmode").onclick = function() {
  document.getElementById("pmode-modal").style.display = "none";
}

window.onclick = function(event) {
  if (event.target == document.getElementById("uinfo-modal")) {
    document.getElementById("uinfo-modal").style.display = "none";
  }
  else if (event.target == document.getElementById("pinfo-modal")) {
    document.getElementById("pinfo-modal").style.display = "none";
  }
  else if (event.target == document.getElementById("linfo-modal")) {
      document.getElementById("linfo-modal").style.display = "none";
  }
  else if (event.target == document.getElementById("pmode-modal")) {
    document.getElementById("pmode-modal").style.display = "none";
  }
  else if (event.target == document.getElementById('id01')) {
      document.getElementById('id01').style.display = "none";
  }
}
