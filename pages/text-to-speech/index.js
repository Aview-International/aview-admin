import { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import TextArea from '../../components/FormComponents/Textarea';
import DropdownArrow from '../../public/img/icons/dropdown-arrow.svg';
import Image from 'next/image';
import Button from '../../components/UI/Button';
import { tts } from '../../services/api';

const TestSpeakerTranslate = () => {
  return (
    <>
      <PageTitle title="History" />
      <h2 className="mt-s2 text-4xl">Text to Speech</h2>
      <Container />
    </>
  );
};

const Container = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropDownValue, setDropDownValue] = useState('aview');
  const [speech, setSpeech] = useState('');
  const [audioURL, setAudioURL] = useState(null);
  const [activeSpeaker, setActiveSpeaker] = useState(0);
  const [speakers, setSpeakers] = useState([
    { id: 0, name: 'Speaker 1', text: '', avatar: '👤' },
    { id: 1, name: 'Speaker 2', text: '', avatar: '👥' },
  ]);

  const addSpeaker = () => {
    const newSpeaker = {
      id: speakers.length,
      name: `Speaker ${speakers.length + 1}`,
      text: '',
      avatar: '🎤',
    };
    setSpeakers([...speakers, newSpeaker]);
  };

  const handleSpeakerClick = (speakerId) => {
    if (activeSpeaker !== null) {
      setSpeakers((prev) =>
        prev.map((speaker) =>
          speaker.id === activeSpeaker ? { ...speaker, text: speech } : speaker
        )
      );
    }

    setActiveSpeaker(speakerId);
    const selectedSpeaker = speakers.find((s) => s.id === speakerId);
    setSpeech(selectedSpeaker?.text || '');
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setSpeech(newText);

    setSpeakers((prev) =>
      prev.map((speaker) =>
        speaker.id === activeSpeaker ? { ...speaker, text: newText } : speaker
      )
    );
  };

  const handleGenerateSpeech = async () => {
    try {
      console.log('Generating:', speech);
      const res = await tts(speech);
      const url = URL.createObjectURL(res);
      setAudioURL(url);
      console.log(res);
      // Here you would typically call your TTS service with the current speech text
      console.log('Generating speech');
    } catch (error) {
      console.log(error);
    }
    // For now, we just log it to the console
  };
  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-[#ffffff26] to-[#ffffff0D] px-s3 py-s1">
      <div className="flex h-full w-full justify-end py-2">
        <div
          className="relative flex h-10 w-40 cursor-pointer flex-row items-start justify-between rounded-md border-2 border-white"
          onClick={() => setOpenDropdown(!openDropdown)}
        >
          <p className="w-4/5 p-2">{dropDownValue}</p>
          <div className="flex h-full w-1/5 items-center justify-end p-2">
            <Image
              src={DropdownArrow}
              width={20}
              height={20}
              className={`${openDropdown ? 'rotate-180' : ''}`}
            />
          </div>
          {openDropdown && (
            <div className="absolute top-10 z-20 flex h-32 w-full flex-col items-center justify-center overflow-y-scroll rounded-sm border-2 border-white bg-black">
              <div className="flex w-full flex-col">
                {[
                  'Chatterbox',
                  'google',
                  'grok',
                  'openai',
                  'eleven labs',
                  'figma',
                ].map((item, index) => (
                  <p
                    key={index}
                    className="hover:bg-gray-800 border-b-2 border-white p-1 text-lg"
                    onClick={() => {
                      setDropDownValue(item);
                      setOpenDropdown(false);
                    }}
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3 overflow-x-auto pb-2">
        {speakers.map((speaker) => (
          <div
            key={speaker.id}
            className={`flex min-w-fit cursor-pointer items-center gap-2 rounded-lg border-2 px-4 py-2 transition-all ${
              activeSpeaker === speaker.id
                ? 'border-blue-500 bg-blue-500/20'
                : 'hover:border-gray-300 border-white'
            }`}
            onClick={() => handleSpeakerClick(speaker.id)}
          >
            <span className="text-xl">{speaker.avatar}</span>
            <span className="whitespace-nowrap text-sm font-medium">
              {speaker.name}
            </span>
          </div>
        ))}

        <button
          onClick={addSpeaker}
          className="flex min-w-fit items-center justify-center rounded-lg border-2 border-dashed border-white/50 p-2 transition-all hover:border-white hover:bg-white/10"
          title="Add Speaker"
        >
          <span className="text-xl">➕</span>
        </button>
      </div>

      <div className="mb-4 h-80 w-full overflow-y-auto rounded-lg border-2 border-white/30 bg-black/30 p-4">
        {speakers.length === 0 ? (
          <p className="text-white/50">No speakers available...</p>
        ) : (
          <div className="space-y-3">
            {speakers.map((speaker, index) => (
              <div key={speaker.id} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{speaker.avatar}</span>
                  <span
                    className={`font-medium ${
                      activeSpeaker === speaker.id
                        ? 'text-blue-400'
                        : 'text-white'
                    }`}
                  >
                    {speaker.name}:
                  </span>
                </div>
                <p
                  className={`ml-5 ${
                    activeSpeaker === speaker.id
                      ? 'text-white'
                      : 'text-white/70'
                  } ${!speaker.text ? 'italic text-white/40' : ''}`}
                >
                  {speaker.text || 'No text entered'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex h-full w-full flex-col items-start justify-start">
        <div className="h-full w-full">
          <TextArea
            _id="test-textarea"
            placeholder={`Type something for ${
              speakers.find((s) => s.id === activeSpeaker)?.name || 'speaker'
            }...`}
            value={speech}
            onChange={handleTextChange}
            bgColor="bg-black"
            textBlack={true}
          />
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button
          theme="dark"
          className="w-20"
          purpose={'onClick'}
          onClick={handleGenerateSpeech}
        >
          Generate Speech
        </Button>
      </div>
      {audioURL && (
        <div className="mt-s2 flex items-center gap-s2">
          <audio controls autoPlay src={audioURL}>
            Your browser does not support the audio element.
          </audio>
          <a href={audioURL} download="speech.wav">
            <Button theme="dark">Download</Button>
          </a>
        </div>
      )}
    </div>
  );
};

TestSpeakerTranslate.getLayout = DashboardLayout;

export default TestSpeakerTranslate;
