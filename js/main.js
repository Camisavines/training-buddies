(function(){
  $(document).ready(initialize);

  // Initialize Firebase
   var config = {
     apiKey: "AIzaSyDUkipA04NrnVyImRH7pNl3R6sSRG_CYS0",
     authDomain: "training-buddies-32c08.firebaseapp.com",
     databaseURL: "https://training-buddies-32c08.firebaseio.com",
     projectId: "training-buddies-32c08",
     storageBucket: "training-buddies-32c08.appspot.com",
     messagingSenderId: "296167881833"
   };

  function initialize(){
    // alert('You better stop!');
    firebase.initializeApp(config);
    $('#submit').click(writeData);
    $('#login').click(goHome);
    loadData();
  }

function goHome() {
  window.location.replace('../html/home.html')
}

  function writeData(e){
    e.preventDefault();
    var fname = $('#first_name').val();
    var lname = $('#last_name').val();
    var email = $('#email').val();
    var dob = $('#datepicker').val();
    var bio = $('#bio').val();
    // var fileINput = $('#file')[0];
    // var file = fileINput.files[0];
    //
    // if(!file){
    //   alert("You did not upload a profile photo.");
    //   return;
    // }

    // var storageRef = firebase.storage().ref('photos/' + file.name);
    // storageRef.put(file, {contentType:file.type});

    // console.log(password);

    // Create an object for all of our data
    var data = {
        fname:fname,
        lname:lname,
        email:email,
        datepicker:dob,
        bio:bio,
    };

    // console.log(data);

    // Send data to firebase and reload page
    var ref = firebase.database().ref('Project').push(data).then(function(){
      firebase.database().ref('Project').on('child_added', function(snapshot){
          var key = snapshot.key;
          console.log(key);

          localStorage.setItem('uid', key);
          //get local storage - localStorage.uid

          var fileINput = $('#file')[0];
          var file = fileINput.files[0];

          if(!file){
            alert("You did not upload a profile photo.");
            return;
          }

          var storageRef = firebase.storage().ref('photos/' + key);
          storageRef.put(file, {contentType:file.type}).then(function(){
            window.location.replace("../html/home.html")
          })
      });
    });
    // window.location.replace("../html/home.html");
  }

  function loadData(){
    firebase.database().ref('Project').on('child_added',function(snapshot){
      var data = snapshot.val();
      $('.name').append('<h2>' + data.fname + " " +data.lname + '</h2>');
      // $('.lname').append('<h1>' + data.lname + '</h1>');
      $(".bio").val(data.bio);
      $('.email').val(data.email);
      editProfile();

      var storageRef = firebase.storage().ref('photos/' + localStorage.uid);
      console.log(storageRef);
      storageRef.getDownloadURL().then(function(url){
        console.log(url);
        $('#userImage').attr('src', url);
      });
    });
  }

  function editProfile() {
    firebase.database().ref('Project').on('child_added',function(snapshot){
      var data = snapshot.val();
      // document.getElementById("#edit_fname").value = editfname;
      // document.getElementById("#edit_lname").value = editlname;
      $('#edit_fname').attr('placeholder', data.fname);
      $('#edit_lname').attr('placeholder', data.lname);
      $('#edit_bio').attr('placeholder', data.bio);
      $('#edit_email').attr('placeholder', data.email);
    });
    $('#save').click(updateData);
  }

function updateData(){
  var fname = $('#edit_first_name').val();
  var lname = $('#edit_last_name').val();
  var email = $('#edit_email').val();
  var dob = $('#edit_datepicker').val();
  var bio = $('#edit_bio').val();
}



})();
