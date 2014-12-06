var url = document.URL;
if ((url.search('/explore') > 0)) {
  $('#explore-li').addClass('active');
}
if ((url.search('/user') > 0)) {
  $('#user-li').addClass('active');
}
if ((url.search('/profile') > 0)) {
  $('#profile-li').addClass('active');
}
if ((url.search('/submissions') > 0)) {
  $('#submissions-li').addClass('active');
}

if ((url.search('/codex') > 0)) {
  $('#codex-li').addClass('active');
}
