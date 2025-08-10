import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  X,
  Minimize2,
  Maximize2,
  Phone,
  Calendar,
  HelpCircle,
  Clock,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  title: string;
  action: string;
}

const quickActions: QuickAction[] = [
  {
    id: "booking",
    icon: <Calendar className="h-4 w-4" />,
    title: "حجز موعد",
    action: "أريد حجز موعد في العيادة",
  },
  {
    id: "emergency",
    icon: <Phone className="h-4 w-4" />,
    title: "حالة طارئة",
    action: "أحتاج مساعدة فورية - حالة طارئة",
  },
  {
    id: "services",
    icon: <HelpCircle className="h-4 w-4" />,
    title: "خدماتنا",
    action: "ما هي الخدمات المتوفرة في العيادة؟",
  },
  {
    id: "hours",
    icon: <Clock className="h-4 w-4" />,
    title: "ساعات العمل",
    action: "ما هي ساعات عمل العيادة؟",
  },
];

const predefinedResponses: Record<string, string> = {
  "حجز موعد":
    'يمكنك حجز موعد بسهولة من خلال النقر على زر "احجز موعداً الآن" في الصفحة الرئيسية، أو عبر الاتصال بنا على 777-123-456. نحن متاحون من السبت إلى الخميس من 9 صباحاً حتى 9 مساءً.',
  "حالة طارئة":
    "في حالات الطوارئ، يرجى الاتصال فوراً على الرقم 777-123-456. نحن نوفر خدمة الطوارئ على مدار الساعة لضمان حصولك على الرعاية اللازمة.",
  خدماتنا:
    "نقدم خدمات شاملة تشمل: تنظيف الأسنان، حشوات تجميلية، تقويم الأسنان، زراعة الأسنان، تبييض الأسنان، علاج جذور الأسنان، وتركيبات الأسنان. جميع خدماتنا تتم بأحدث التقنيات الطبية.",
  "ساعات العمل":
    "ساعات عملنا: من السبت إلى الخميس: 9:00 صباحاً - 9:00 مساءً، يوم الجمعة: 2:00 ظهراً - 9:00 مساءً. كما نوفر خدمة الطوارئ على مدار الساعة.",
  أسعار:
    "أسعارنا تنافسية ومناسبة. نقبل معظم بطاقات التأمين الطبي. للاستفسار عن أسعار خدمة معينة، يرجى الاتصال بنا أو زيارة العيادة للحصول على استشارة مجانية.",
  موقع: "تقع عيادتنا في موقع مميز وسهل الوصول. يمكنكم زيارتنا أو الاتصال بنا لمعرفة الاتجاهات الدقيقة.",
  دكتور:
    "الدكتور كمال الملصي هو طبيب أسنان معتمد مع أكثر من 15 سنة من الخبرة في مجال طب الأسنان. متخصص في جميع مجالات طب الأسنان وحاصل على عدة شهادات مهنية.",
};

export const AIChatSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "مرحباً بك في عيادة الدكتور كمال الملصي! 👋\nكيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Check for keywords in predefined responses
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (
        message.includes(key.toLowerCase()) ||
        (message.includes("موعد") && key.includes("حجز")) ||
        (message.includes("طارئ") && key.includes("حالة")) ||
        (message.includes("خدم") && key.includes("خدمات")) ||
        (message.includes("ساعات") && key.includes("ساعات")) ||
        (message.includes("سعر") && key.includes("أسعار")) ||
        (message.includes("مكان") && key.includes("موقع")) ||
        (message.includes("دكتور") && key.includes("دكتور"))
      ) {
        return response;
      }
    }

    // Default response with helpful suggestions
    return "شكراً لتواصلك معنا! 😊\nيمكنني مساعدتك في:\n• حجز المواعيد\n• معلومات عن خدماتنا\n• ساعات العمل\n• حالات الطوارئ\n\nأو يمكنك الاتصال بنا مباشرة على 777-123-456";
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: generateBotResponse(content),
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      },
      1000 + Math.random() * 1000,
    );
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-dental-primary hover:bg-dental-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-arabic opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          تحدث معنا
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-all duration-300 ${
        isMinimized ? "w-80" : "w-96"
      }`}
    >
      <Card
        className={`transition-all duration-300 shadow-2xl ${
          isMinimized ? "h-16" : "h-[600px]"
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-dental-primary text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-sm font-arabic">
              مساعد العيادة الذكي
            </CardTitle>
            <Badge className="bg-green-500 text-white text-xs">متصل</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-64px)]">
            {/* Quick Actions */}
            <div className="p-4 border-b bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="justify-start text-xs font-arabic"
                  >
                    {action.icon}
                    <span className="mr-2">{action.title}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.type === "user"
                        ? "bg-dental-primary text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === "bot" && (
                        <Bot className="h-4 w-4 mt-1 text-dental-primary" />
                      )}
                      {message.type === "user" && (
                        <User className="h-4 w-4 mt-1" />
                      )}
                      <div>
                        <p className="text-sm font-arabic whitespace-pre-line">
                          {message.content}
                        </p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString("ar-SA", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-dental-primary" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 font-arabic"
                  dir="rtl"
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-dental-primary hover:bg-dental-primary/90"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AIChatSupport;
