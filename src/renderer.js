// Globals
let mus = null;
let mus_id = null;

document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
    const isDarkMode = await window.darkMode.toggle()
    document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
  })
  
  document.getElementById('reset-to-system').addEventListener('click', async () => {
    await window.darkMode.system()
    document.getElementById('theme-source').innerHTML = 'System'
  })

  document.getElementById('open-files').addEventListener('click', async () => {
    await window.bruh.capping()
    //mus.volume = 0.5
    if (mus) {
      if (mus.paused)
      {
        mus.play();
      }
      else{
        mus.pause();
      }
    }
  })

  // Allows the song to be looped
  document.getElementById('Loop').addEventListener('click', async () => {
    if (mus) {
      mus.loop = !mus.loop;
      console.log("Ths song loop is set to: ", mus.loop)
    }
  });

  // [oninput] is dynamic and is called while the mouse is dragging and the value changes
  // Adjust volume
  document.getElementById('MusVolume').oninput = function() {
    if (mus) {
      const new_volume = this.value / 100;
      mus.volume = new_volume
    }
  };

  document.getElementById('MusVolume').onchange = function() {
    if (mus) {
      const new_volume = this.value / 100;
      console.log(new_volume)
      //mus.volume = new_volume
    }
  };

  // Adjust song position
  document.getElementById('MusTime').onchange = function() {
    if (mus) {
      const new_time = this.value;
      console.log(new_time)
      mus.currentTime = new_time
    }
  };
  
  document.getElementById('open-files2').addEventListener('click', async () => {
    const dialogConfig = {
      title: 'Select a file',
      buttonLabel: 'This one will do',
      properties: ['openFile']
    };

    const file = await electron.openDialog('showOpenDialog', dialogConfig)
      //.then(result => console.log(result));
    
    console.log("This is our file")
    console.log(file)
    
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
    let audio = new Audio(file.filePaths[0])

    // Set max length of playing song
    audio.addEventListener("loadedmetadata", function(_event) {
      var duration = audio.duration;
      mus_duration.max = duration
      console.log(duration);
    });

    audio.volume = 0.05
    audio.currentTime = 150 //for testing
    audio.play()

    mus = audio;

    // Match starting time of loaded file
    let mus_duration = document.getElementById('MusTime')
    mus_duration.value = mus.currentTime
    console.log(mus.currentTime, mus.duration)

    // When a music file is told to play
    mus.onplay = (event) => {
      console.log('The Boolean paused property is now false. Either the ' +
      'play() method was called or the autoplay attribute was toggled.');

      // Start a tracker to update the progress bar
      mus_id = setInterval(updateTime, 500);

      function updateTime() {
          console.log("Checking");
          if (mus)
          {
            mus_duration.value = mus.currentTime
          }
      }
    };

    //ToDo: move this somewhere else
    mus.onended = (event) => {
      console.log('Music stopped either because 1) it was over, ' +
          'or 2) no further data is available.');
      clearInterval(mus_id);
    };

    // If paused, stop the interval, it will be restarted from the onplay() event
    mus.onpause = (event) => {
      console.log('The Boolean paused property is now true. Either the ' +
      'pause() method was called or the autoplay attribute was toggled.');
      clearInterval(mus_id);
    };
  })

  function move() {
    var progress = document.getElementById("progressbar");
    var width = 1;
    var id = setInterval(frame, 100);
  
    function frame() {
      if (width >= 100) {
        clearInterval(id);
      } else {
        width++;
        progress.value = width
      }
    }
  }