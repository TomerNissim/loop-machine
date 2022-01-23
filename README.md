# Loop Machine App

## General Description

The Loop Machine app allows playing multiple audio channels simultaneously, with the option to mute and un-mute each channel individually. The app requires that all samples have the same length and BPM. The application is based on the node.js framework, using HTML, JavaScript, and CSS.
Libraries used: react for the user interface and MUI/Material for the slider bar.

## Functional Description

There are three main buttons at the bottom of the page: (i) play - plays all sample files, (ii) stop - stops all sample files and brings them back to the starting point them to the beginning, (iii) loop - when pressed, the samples are played in repeat. Moreover, there is a mute button per channel located on the left side of the board and a cursor on the top of the board that presents the current time of the samples. The user can manually adjust the current time of the samples by dragging the cursor along the bar.

## Implementation Notes

The number of channels to be displayed is hardcoded but controlled from a single variable that holds the names of the audio files (channels) to be played. You can add or remove channels by adding or removing audio files, and the graphical user interface adjusts automatically. I chose eight different colors for the audio channels. If you add more than eight audio files, the colors for the additional channels will be repeated. 

I used MUI/Material slider bar to display the playback time ticks and current playback time and allow users to drag and drop playback location. The slider bar length depends on the audio size. I added a cursor (thumb extension), synchronizing between them by appending the cursor to the slider bar thumb.

To received audio playback data (duration, current playback time) i added a mockup channel(named - masterAudioElement). This channel helps to manage the slide bar. 

### Project Deployment 
url: https://loop-machine0268.herokuapp.com