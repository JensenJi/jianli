import { User } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';
import EditableText from './EditableText';

export default function About() {
  const { aboutMe, aboutPhilosophy, isEditMode } = useResumeStore();

  return (
    <section id="about" className="w-full py-8 px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <User className="h-8 w-8 text-cyan-400" />
          关于我
        </h2>
        <div className="space-y-4">
          <EditableText
            value={aboutMe}
            onChange={(value) => useResumeStore.getState().setAboutMe(value)}
            isEditMode={isEditMode}
            placeholder="输入关于你的介绍..."
            isMultiline={true}
            className="text-gray-300 leading-relaxed"
          />
          <EditableText
            value={aboutPhilosophy}
            onChange={(value) => useResumeStore.getState().setAboutPhilosophy(value)}
            isEditMode={isEditMode}
            placeholder="输入你的开发理念..."
            isMultiline={true}
            className="text-gray-300 leading-relaxed"
          />
        </div>
      </div>
    </section>
  );
}
