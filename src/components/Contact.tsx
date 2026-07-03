import { QrCode, Mail, Phone, MapPin, Github, Linkedin, Globe, Send, Contact as AddressCard, Plus, X } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import EditableImage from "./EditableImage";
import EditableText from "./EditableText";

export default function Contact() {
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { contactItems, setContactItems, socialItems, setSocialItems, qrCodeUrl, setQrCodeUrl, isEditMode } = useResumeStore();
  const [editingContactIndex, setEditingContactIndex] = useState<number | null>(null);
  const [editingSocialIndex, setEditingSocialIndex] = useState<number | null>(null);
  const [tempContact, setTempContact] = useState({ label: "", value: "" });
  const [tempSocial, setTempSocial] = useState({ label: "", value: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCaptchaVerified) {
      alert("请先完成人机验证");
      return;
    }
    if (!formData.name || !formData.email || !formData.message) {
      alert("请填写完整信息");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          access_key: "YOUR_ACCESS_KEY_HERE", // 请替换为您的Web3Forms访问密钥
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: "来自个人简历网站的新消息",
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("消息发送成功！");
        setFormData({ name: "", email: "", message: "" });
        setIsCaptchaVerified(false);
      } else {
        alert("发送失败：" + result.message);
      }
    } catch (error) {
      console.error("发送失败：", error);
      alert("发送失败，请稍后再试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addContactItem = () => {
    if (tempContact.label && tempContact.value) {
      setContactItems([...contactItems, { icon: "Mail", label: tempContact.label, value: tempContact.value }]);
      setTempContact({ label: "", value: "" });
    }
  };

  const removeContactItem = (index: number) => {
    setContactItems(contactItems.filter((_, i) => i !== index));
  };

  const updateContactItem = (index: number, field: "label" | "value", value: string) => {
    const newItems = [...contactItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setContactItems(newItems);
  };

  const addSocialItem = () => {
    if (tempSocial.label && tempSocial.value) {
      setSocialItems([...socialItems, { icon: "Github", label: tempSocial.label, value: tempSocial.value }]);
      setTempSocial({ label: "", value: "" });
    }
  };

  const removeSocialItem = (index: number) => {
    setSocialItems(socialItems.filter((_, i) => i !== index));
  };

  const updateSocialItem = (index: number, field: "label" | "value", value: string) => {
    const newItems = [...socialItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setSocialItems(newItems);
  };

  const getIconForItem = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Mail: <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0" />,
      Phone: <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0" />,
      MapPin: <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0" />,
      Github: <Github className="w-5 h-5 text-cyan-400 flex-shrink-0" />,
      Linkedin: <Linkedin className="w-5 h-5 text-cyan-400 flex-shrink-0" />,
      Globe: <Globe className="w-5 h-5 text-cyan-400 flex-shrink-0" />,
    };
    return iconMap[iconName] || <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0" />;
  };

  return (
    <section id="contact" className="w-full py-8 px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <AddressCard className="h-8 w-8 text-cyan-400" />
          联系方式 & 二维码
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 左侧：联系方式和二维码 */}
          <div className="space-y-6">
            <div className="bg-gray-950/50 border border-gray-700/50 rounded-xl p-6">
              <div className="mb-6 flex justify-center">
                <div className="bg-gray-900 border-2 border-dashed border-gray-600 rounded-xl p-6 flex flex-col items-center gap-3 w-full max-w-[200px]">
                  <EditableImage
                    src={qrCodeUrl}
                    alt="二维码"
                    placeholderIcon={<QrCode className="w-20 h-20 text-cyan-400" />}
                    onChange={setQrCodeUrl}
                    isEditMode={isEditMode}
                    aspect={1}
                    className="w-full h-32 flex items-center justify-center"
                  />
                  <span className="text-gray-400 text-sm font-medium">扫描二维码联系我</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
                  <AddressCard className="w-5 h-5" />
                  联系方式信息
                </h3>

                <div className="space-y-3">
                  {contactItems.map((item, index) => (
                    <div key={index} className={`flex items-center gap-3 ${isEditMode ? "group relative" : ""}`}>
                      {getIconForItem(item.icon)}
                      {isEditMode ? (
                        <>
                          <input
                            value={item.label}
                            onChange={(e) => updateContactItem(index, "label", e.target.value)}
                            className="bg-gray-950/50 border border-gray-700 rounded px-2 py-1 text-sm text-gray-300 font-medium w-16 text-right focus:outline-none focus:border-cyan-500"
                          />
                          <span className="text-gray-400">:</span>
                          <input
                            value={item.value}
                            onChange={(e) => updateContactItem(index, "value", e.target.value)}
                            className="bg-gray-950/50 border border-gray-700 rounded px-2 py-1 text-sm text-cyan-300 flex-1 focus:outline-none focus:border-cyan-500"
                          />
                          <button
                            onClick={() => removeContactItem(index)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-gray-300 font-medium w-16 text-right">{item.label}</span>
                          <span className="text-gray-400">:</span>
                          <span className="text-cyan-300 text-sm">{item.value}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {isEditMode && (
                  <div className="flex gap-2 mt-3">
                    <input
                      value={tempContact.label}
                      onChange={(e) => setTempContact({ ...tempContact, label: e.target.value })}
                      placeholder="标签"
                      className="bg-gray-950/50 border border-gray-700 rounded px-2 py-1 text-sm text-white w-20 focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      value={tempContact.value}
                      onChange={(e) => setTempContact({ ...tempContact, value: e.target.value })}
                      placeholder="值"
                      className="bg-gray-950/50 border border-gray-700 rounded px-2 py-1 text-sm text-white flex-1 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={addContactItem}
                      className="w-8 h-8 bg-cyan-600 hover:bg-cyan-700 rounded text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="pt-4 mt-4 border-t border-gray-700 space-y-3">
                  {socialItems.map((item, index) => (
                    <div key={index} className={`flex items-center gap-3 ${isEditMode ? "group relative" : ""}`}>
                      {getIconForItem(item.icon)}
                      {isEditMode ? (
                        <>
                          <input
                            value={item.label}
                            onChange={(e) => updateSocialItem(index, "label", e.target.value)}
                            className="bg-gray-950/50 border border-gray-700 rounded px-2 py-1 text-sm text-gray-300 font-medium w-20 text-right focus:outline-none focus:border-cyan-500"
                          />
                          <span className="text-gray-400">:</span>
                          <input
                            value={item.value}
                            onChange={(e) => updateSocialItem(index, "value", e.target.value)}
                            className="bg-gray-950/50 border border-gray-700 rounded px-2 py-1 text-sm text-cyan-300 flex-1 focus:outline-none focus:border-cyan-500"
                          />
                          <button
                            onClick={() => removeSocialItem(index)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-gray-300 font-medium w-20 text-right">{item.label}</span>
                          <span className="text-gray-400">:</span>
                          <span className="text-cyan-300 text-sm">{item.value}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {isEditMode && (
                  <div className="flex gap-2 mt-3">
                    <input
                      value={tempSocial.label}
                      onChange={(e) => setTempSocial({ ...tempSocial, label: e.target.value })}
                      placeholder="标签"
                      className="bg-gray-950/50 border border-gray-700 rounded px-2 py-1 text-sm text-white w-24 focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      value={tempSocial.value}
                      onChange={(e) => setTempSocial({ ...tempSocial, value: e.target.value })}
                      placeholder="值"
                      className="bg-gray-950/50 border border-gray-700 rounded px-2 py-1 text-sm text-white flex-1 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={addSocialItem}
                      className="w-8 h-8 bg-cyan-600 hover:bg-cyan-700 rounded text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：发送消息表单 */}
          <div className="bg-gray-950/50 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-cyan-400 mb-6 flex items-center gap-2">
              <Send className="w-5 h-5" />
              发送消息
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="您的姓名"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <input
                type="email"
                placeholder="您的邮箱"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <textarea
                placeholder="您的消息"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              />

              {/* Cloudflare Turnstile */}
              <div className="flex justify-center py-2">
                <Turnstile
                  siteKey="1x00000000000000000000AA"
                  onSuccess={() => setIsCaptchaVerified(true)}
                  onExpire={() => setIsCaptchaVerified(false)}
                  options={{ theme: "dark" }}
                />
              </div>

              <button
                type="submit"
                disabled={!isCaptchaVerified || isSubmitting}
                className={`w-full font-bold py-3 px-6 rounded-lg transition-all shadow-lg ${
                  isCaptchaVerified && !isSubmitting
                    ? "bg-gradient-to-r from-cyan-400 to-purple-600 text-gray-900 hover:opacity-90 shadow-cyan-500/30"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed shadow-gray-700/20"
                }`}
              >
                <Send className="w-5 h-5 inline mr-2" />
                {isSubmitting ? "发送中..." : "发送消息"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
