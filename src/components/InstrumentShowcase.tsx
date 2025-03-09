
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const instruments = [
  {
    id: 'begena',
    name: 'Begena',
    description: 'Known as "King David\'s Harp," the begena is a ten-string lyre used primarily in religious contexts. Its deep, resonant sound is believed to facilitate meditation and spiritual reflection.',
    image: 'https://www.imusic-school.com/blog/wp-content/uploads/2021/03/Illustration-begena.png'
  },
  {
    id: 'kirar',
    name: 'Kirar',
    description: 'A five or six-stringed lyre commonly used in secular Ethiopian music. The kirar produces bright, vibrant tones and is often used to accompany singers and dancers at celebrations.',
    image: 'https://grandview-mercantile.storage.googleapis.com/wp-content/uploads/2023/03/20161932/ZTRA_112-2.jpg'
  },
  {
    id: 'washent',
    name: 'washent',
    description: 'A five or six-stringed lyre commonly used in secular Ethiopian music. The kirar produces bright, vibrant tones and is often used to accompany singers and dancers at celebrations.',
    image: 'https://www.horniman.ac.uk/media-collection/163/516/WI_M19_4_66_3.jpg'
  },
  {
    id: 'masinko',
    name: 'Masinko',
    description: 'A single-stringed bowed lute with a diamond-shaped sound box. The masinko is known for its expressive, voice-like quality that can mimic the human voice in traditional Ethiopian storytelling.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/COLLECTIE_TROPENMUSEUM_Langhalsluit_met_1_snaar_TMnr_2997-19a.jpg'
  },
  {
    id: 'kabaro',
    name: 'Kabaro',
    description: 'A double-headed drum used in religious ceremonies. The kabaro\'s rhythmic patterns guide the congregation and accompany the mezmur hymns during orthodox services.',
    image: 'https://www.shutterstock.com/image-illustration/tradtional-ethiopian-drum-3d-render-600nw-2161938547.jpg'
  }
];

const InstrumentShowcase = () => {
  const [activeInstrument, setActiveInstrument] = useState(instruments[0].id);
  
  return (
    <section id="instruments" className="relative section-padding bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-ethiopia-parchment to-transparent"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-ethiopia-terracotta/10 text-ethiopia-terracotta inline-block mb-4">
            Traditional Instruments
          </span>
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Discover the Sacred Sounds</h2>
          <p className="text-muted-foreground">
            Explore the traditional instruments that form the foundation of Ethiopian Orthodox music, each with its own unique history and spiritual significance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Instrument Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-ethiopia-sand/20 shadow-soft p-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeInstrument}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full rounded-xl overflow-hidden"
                >
                  <img 
                    src={instruments.find(i => i.id === activeInstrument)?.image} 
                    alt={instruments.find(i => i.id === activeInstrument)?.name} 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Floating accent */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-ethiopia-amber/10 z-[-1]"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-ethiopia-terracotta/10 z-[-1]"></div>
          </div>
          
          {/* Instrument Details */}
          <div className="space-y-8">
            <div className="flex flex-wrap gap-3">
              {instruments.map((instrument) => (
                <button
                  key={instrument.id}
                  onClick={() => setActiveInstrument(instrument.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm transition-all duration-300",
                    activeInstrument === instrument.id 
                      ? "bg-ethiopia-amber text-white shadow-md" 
                      : "bg-ethiopia-sand/30 text-foreground hover:bg-ethiopia-sand/50"
                  )}
                >
                  {instrument.name}
                </button>
              ))}
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeInstrument}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-serif">
                  {instruments.find(i => i.id === activeInstrument)?.name}
                </h3>
                <p className="text-muted-foreground">
                  {instruments.find(i => i.id === activeInstrument)?.description}
                </p>
                <a 
                  href="#learn-more" 
                  className="inline-flex items-center text-ethiopia-amber hover:text-ethiopia-terracotta transition-colors"
                >
                  Learn to play <span className="ml-1">→</span>
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstrumentShowcase;
