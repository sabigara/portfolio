#    This file is part of PyChoReLib.
#
#    PyChoReLib is free software; you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation; either version 2 of the License, or
#    (at your option) any later version.
#
#    PyChoReLib is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with PyChoReLib; if not, write to the Free Software
#    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

from .Exceptions import *
from .Chord import Chord
from .ChordRecognizer import ChordRecognizer
import sys
try:
        import pypm
except ImportError:
        print("Error! You need to install the PyPortMidi package in order to use this demo program.")
        sys.exit(1)

class MidiNumberToNoteName(object):
        """
        Class to convert a list of midi note numbers to note names suitable for use in the ChordRecognizer
        """
        def __init__(self):
                self.ChromaticScale = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b']
                self.NoteNameDict = {}
                for N in range(127):
                        self.NoteNameDict[N] = self.ChromaticScale[N % 12]

        def MidiNumberListToNoteNameList(self, MidiNrList):
                ResultList = []
                for I in MidiNrList:
                        ResultList.append(self.NoteNameDict[I])
                return ResultList

class ChordExplorer(object):
        """
        Simple midi message interpreter. Every time a note-on or note-off message
        is sent, the chord formed by all the active notes is matched and returned.
        """
        def __init__(self):
                self.NoteOnOffMap = {}
                for N in range(127):
                        self.NoteOnOffMap[N] = 0
                self.CR = ChordRecognizer()
                self.MidiToNoteConverter = MidiNumberToNoteName()

        def ListMidiInputDevices(self):
                Found = 0
                for DeviceNr in range(pypm.CountDevices()):
                         Interface,Name,Inp,Outp,Opened = pypm.GetDeviceInfo(DeviceNr)
                         if Inp==1: # input devices only
                                Found = 1
                                print("Device Number: ", DeviceNr, "Interface: ",Interface, "Name: ",Name)
                if Found == 0:
                        print("*** No MIDI input devices found! Consider using a virtual midi keyboard (e.g. vkeyb on linux)")
                        print("Going back to command line now.")
                        sys.exit(1)
                              

        def ExtractNotesFromMap(self):
                MidiNrList = []
                for Key in list(self.NoteOnOffMap.keys()):
                        if self.NoteOnOffMap[Key] != 0:
                                MidiNrList.append(Key)
                if len(MidiNrList)>2:
                        return self.MidiToNoteConverter.MidiNumberListToNoteNameList(MidiNrList)
                else:
                        return []

        def InitializeMidiInput(self):
                print("The following MIDI input devices are detected on your system: ")
                self.ListMidiInputDevices()
                dev = int(input("Please type a device number from the list: "))
                self.MidiIn = pypm.Input(dev)
                print("Midi Input opened. Waiting for chords of 3 notes or more...")

        def Step(self):
                while not self.MidiIn.Poll(): pass
                MidiData = self.MidiIn.Read(1) # read only 1 message at a time
                # update map
                self.NoteOnOffMap[MidiData[0][0][1]] = MidiData[0][0][2] # MidiData[0][0][1] contains the note number, MidiData[0][0][2] contains the velocity
                # convert map to notelist
                NoteList = self.ExtractNotesFromMap()
                # convert NoteList to chord
                if NoteList != []:
                        try:
                                print("Found chord: ", self.CR.RecognizeChord(Chord(NoteList)))
                        except InvalidInput:
                                print("Programming Error: invalid input for ChordRecognizer.")
                        except NoMatch:
                                pass
                        except:
                                print("Unexpected Error.")

        def Finish(self):
                del self.MidiIn
                                

def main():
        print("Initializing chord recognition system from scratch. This will take some time...")
        CE = ChordExplorer()
        print("Finished chord initialization system.")
        print("Autodetect available midi input devices.")
        CE.InitializeMidiInput()
        try:
                while 1==1:
                        CE.Step()
        except KeyboardInterrupt:
                CE.Finish()
                print("Finishing the recognizer...")
        
if __name__ == "__main__":
        main()

