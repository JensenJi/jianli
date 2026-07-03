import { Cog, Plus, X, Code2, Palette, Layout } from "lucide-react";
import { useResumeStore } from "@/store/resumeStore";
import { useState } from "react";

export default function Skills() {
  const { frontendSkills, setFrontendSkills, styleSkills, setStyleSkills, designSkills, setDesignSkills, isEditMode } = useResumeStore();
  const [newFrontendSkill, setNewFrontendSkill] = useState("");
  const [newStyleSkill, setNewStyleSkill] = useState("");
  const [newDesignSkill, setNewDesignSkill] = useState("");

  const addSkill = (
    skills: string[],
    setSkills: (skills: string[]) => void,
    newSkill: string,
    setNewSkill: (skill: string) => void
  ) => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skills: string[], setSkills: (skills: string[]) => void, skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const getIconForSkillCategory = (title: string) => {
    const iconMap: Record<string, any> = {
      "前端": Code2,
      "样式与工具": Palette,
      "设计与用户体验": Layout,
    };
    const Icon = iconMap[title] || Cog;
    return <Icon className="w-12 h-12 text-cyan-400 mb-6" />;
  };

  const SkillList = ({ 
    title, 
    skills, 
    setSkills, 
    newSkill, 
    setNewSkill 
  }: { 
    title: string, 
    skills: string[], 
    setSkills: (skills: string[]) => void,
    newSkill: string,
    setNewSkill: (skill: string) => void
  }) => (
    <div className={`bg-gradient-to-br from-gray-900/90 to-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/10 ${
      isEditMode ? "group relative" : ""
    }`}>
      {getIconForSkillCategory(title)}
      <h3 className="text-2xl font-bold text-amber-100 mb-6">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className={`px-3 py-1.5 bg-cyan-950/30 border border-cyan-700/30 text-cyan-300 rounded-md text-sm font-medium ${
              isEditMode ? "group/skill relative" : ""
            }`}
          >
            {skill}
            {isEditMode && (
              <button
                onClick={() => removeSkill(skills, setSkills, skill)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover/skill:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
        {isEditMode && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill(skills, setSkills, newSkill, setNewSkill)}
              placeholder="添加技能..."
              className="w-32 bg-gray-950/50 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={() => addSkill(skills, setSkills, newSkill, setNewSkill)}
              className="w-7 h-7 bg-cyan-600 hover:bg-cyan-700 rounded-md text-white flex items-center justify-center transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section id="skills" className="w-full py-8 px-8 max-w-7xl mx-auto">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <h2 className="text-3xl font-bold text-white mb-8 pt-6 flex items-center gap-3">
          <Cog className="h-8 w-8 text-cyan-400" />
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            技术技能
          </span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <SkillList
            title="前端"
            skills={frontendSkills}
            setSkills={setFrontendSkills}
            newSkill={newFrontendSkill}
            setNewSkill={setNewFrontendSkill}
          />
          <SkillList
            title="样式与工具"
            skills={styleSkills}
            setSkills={setStyleSkills}
            newSkill={newStyleSkill}
            setNewSkill={setNewStyleSkill}
          />
          <SkillList
            title="设计与用户体验"
            skills={designSkills}
            setSkills={setDesignSkills}
            newSkill={newDesignSkill}
            setNewSkill={setNewDesignSkill}
          />
        </div>
      </div>
    </section>
  );
}
