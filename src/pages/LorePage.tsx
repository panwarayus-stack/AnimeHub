import React, { useState } from 'react';
import { Sparkles, Shield, Sword, Heart, Swords, ChevronRight } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  role: string;
  rank: string;
  portrait: string;
  bio: string;
  stats: {
    strength: number;
    agility: number;
    defense: number;
    intelligence: number;
  };
  abilities: string[];
}

const CHARACTERS: Character[] = [
  {
    id: 'jinwoo',
    name: 'Sung Jinwoo',
    role: 'Shadow Monarch (The King of the Dead)',
    rank: 'S-Rank (Limitless)',
    portrait: 'https://image.tmdb.org/t/p/w500/geobm90n8v5K7g7vV80n3UaQ16Z.jpg',
    bio: 'Originally known as the "Weakest Hunter of All Mankind." After surviving a double dungeon in the Cartenon Temple, he was chosen as the vessel of the Shadow Monarch, Ashborn. He possesses the unique ability to "level up" limitlessly and extract shadows from fallen foes.',
    stats: { strength: 99, agility: 98, defense: 95, intelligence: 92 },
    abilities: ['Shadow Extraction ("Arise")', 'Domain of the Monarch', 'Sovereign Authority', 'Stealth', 'Mutilation']
  },
  {
    id: 'haein',
    name: 'Cha Hae-In',
    role: 'Sword Dancer (Vice-Guildmaster of Hunters)',
    rank: 'S-Rank',
    portrait: 'https://image.tmdb.org/t/p/w500/5i6b66S0ccV6g1HGz0Yv6Y9SgD6.jpg',
    bio: 'Korea\'s only female S-rank hunter. Possesses a unique mana-olfactory sensitivity, allowing her to smell the mana of other hunters (which is usually foul, except for Jinwoo\'s, which smells fragrant). A master swordsman with unparalleled reflex speeds.',
    stats: { strength: 82, agility: 88, defense: 75, intelligence: 70 },
    abilities: ['Sword Dance', 'Sword of Light', 'Quake of Light', 'Mana Sensation']
  },
  {
    id: 'igris',
    name: 'Commander Igris',
    role: 'Sovereign Red Knight / Shadow Marshal',
    rank: 'Marshal Grade Shadow',
    portrait: 'https://image.tmdb.org/t/p/w500/775Xn1SreF905p1WbS19K6kM5M9.jpg',
    bio: 'Formerly the blood-red knight who defended an empty throne in the job-change dungeon. After being defeated by Jinwoo, he was extracted to become Jinwoo\'s most loyal and chivalrous shadow soldier, representing honor and absolute martial command.',
    stats: { strength: 88, agility: 92, defense: 85, intelligence: 80 },
    abilities: ['Sovereign Swordplay', 'Telekinetic Sword Pull', 'Unyielding Resolve', 'Shadow Teleportation']
  },
  {
    id: 'beru',
    name: 'Ant King Beru',
    role: 'Swarm Monarch / Shadow General',
    rank: 'General Grade Shadow',
    portrait: 'https://image.tmdb.org/t/p/w500/2wP7t6m66Z689UorAdpUAt6bXQv.jpg',
    bio: 'Born as the apex predator of the Jeju Island mutant ant swarm. He single-handedly slaughtered multiple S-rank hunters before being slain by Jinwoo. Reborn as a shadow, he retains his lethal speed, deep loyalty, and a comical obsession with dramatic theatricality.',
    stats: { strength: 95, agility: 96, defense: 90, intelligence: 85 },
    abilities: ['Predator Shriek', 'Regeneration', 'Size Manipulation', 'Poison Assimilation', 'Flight']
  }
];

export const LorePage: React.FC = () => {
  const [activeChar, setActiveChar] = useState<Character>(CHARACTERS[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="border-b border-white/[0.08] pb-5 text-left">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400 font-bold mb-1.5">
          <Swords className="w-4 h-4" />
          <span>Database &amp; Codex</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight leading-none">
          Characters &amp; Lore
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Discover the profiles, power ratings, and special abilities of the Monarchs, Hunters, and Shadow Soldiers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: List/Toggles of Characters */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 text-left">
            Select Entity
          </h3>
          <div className="space-y-3">
            {CHARACTERS.map(char => {
              const isActive = activeChar.id === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => setActiveChar(char)}
                  className={`w-full p-4 rounded-2xl text-left border flex items-center justify-between transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isActive
                      ? 'bg-blue-600/10 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/10'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.05] hover:border-white/10'
                  }`}
                >
                  <div className="space-y-1">
                    <p className={`text-base font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-200'}`}>
                      {char.name}
                    </p>
                    <p className="text-xs text-slate-400 font-mono tracking-wide">
                      {char.rank}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1 text-blue-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Full Character Bio, Portrait, Stats & Skill Deck */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 sm:p-8 space-y-8 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Portrait Image */}
            <div className="w-full sm:w-44 lg:w-48 aspect-[3/4] shrink-0 rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-xl">
              <img
                src={activeChar.portrait}
                alt={activeChar.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Core details */}
            <div className="space-y-4 text-left flex-1">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-600/20 text-blue-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-blue-500/30">
                  {activeChar.rank}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
                  {activeChar.name}
                </h2>
                <p className="text-xs sm:text-sm text-blue-400 font-semibold tracking-wide">
                  {activeChar.role}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeChar.bio}
              </p>
            </div>
          </div>

          {/* Stats section */}
          <div className="space-y-4 text-left">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Combat Performance Rating</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(activeChar.stats).map(([stat, val]) => (
                <div key={stat} className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex justify-between items-center text-xs font-semibold capitalize font-mono">
                    <span className="text-slate-400">{stat}</span>
                    <span className="text-white">{val}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Abilities block */}
          <div className="space-y-4 text-left pt-2 border-t border-white/[0.06]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sword className="w-4 h-4 text-purple-400" />
              <span>Specialized Hunter Skills</span>
            </h3>

            <div className="flex flex-wrap gap-2.5">
              {activeChar.abilities.map(ability => (
                <div
                  key={ability}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 hover:bg-white/[0.06] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{ability}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
