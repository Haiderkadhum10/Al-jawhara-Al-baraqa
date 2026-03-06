import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { APP_NAME } from "@/lib/constants";
import {
  aboutValues,
  aboutStats,
  aboutMission,
  AboutMissionIcon,
} from "@/lib/data/about";

export function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen py-20 overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary tracking-wide">من نحن</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-black leading-tight tracking-tight"
            >
              شركة
              <span className="block mt-2 bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] bg-clip-text text-transparent">
                {APP_NAME}
              </span>
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="space-y-6 text-lg text-muted-foreground leading-relaxed max-w-xl"
            >
              <p>
                نحن شركة رائدة في مجال استيراد وتوزيع المنتجات الغذائية الفاخرة من مختلف أنحاء العالم.
                تأسست شركتنا بهدف توفير أفضل المنتجات الغذائية المستوردة للمستهلكين في العراق.
              </p>
              <p>
                نفخر بتقديم مجموعة متنوعة من المنتجات عالية الجودة، بما في ذلك العصائر الطبيعية،
                النودلز الآسيوي، التوبوكي الكوري الأصلي، والعديد من المنتجات الأوروبية الفاخرة.
              </p>
              <p className="font-medium text-foreground italic border-r-4 border-primary pr-6 py-2">
                "نؤمن بأن الطعام الجيد يجلب السعادة، ولذلك نحرص على اختيار كل منتج بعناية فائقة لضمان جودته ومذاقه الأصيل."
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-[#c9a85c] to-[#9d7e3a] rounded-[2.5rem] opacity-10 blur-2xl" />
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border border-border/50 group">
              <img
                src="https://images.unsplash.com/photo-1681276145283-dc19e0ffb8d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzEyMzM1NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="متجرنا"
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,92,0.05),transparent_70%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {aboutStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="text-5xl md:text-6xl font-black bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-muted-foreground font-bold tracking-wider uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-20 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black"
          >
            قيمنا
            <span className="bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] bg-clip-text text-transparent"> ومبادئنا</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            نلتزم بمجموعة من القيم الأساسية التي توجه عملنا وتضمن تقديم أفضل خدمة لعملائنا
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {aboutValues.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border/50 rounded-[2rem] p-8 lg:p-12 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] group-hover:w-full group-hover:h-full group-hover:rounded-none transition-all duration-700 -z-10" />
              <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c9a85c]/10 to-[#9d7e3a]/10 group-hover:scale-110 transition-transform group-hover:shadow-xl group-hover:shadow-primary/20">
                    <value.icon className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black group-hover:text-primary transition-colors">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {value.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c9a85c]/5 via-background to-[#9d7e3a]/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto rounded-[3rem] overflow-hidden bg-card border border-border/50 shadow-2xl p-12 md:p-20 text-center"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-[#c9a85c] to-[#9d7e3a] mb-12 shadow-xl shadow-primary/20">
              <AboutMissionIcon className="w-12 h-12 text-white" />
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-start text-right">
              <div className="space-y-6">
                <h3 className="text-3xl font-black flex items-center gap-4">
                  <span className="w-8 h-1 bg-primary rounded-full" />
                  رؤيتنا
                </h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {aboutMission.vision}
                </p>
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl font-black flex items-center gap-4">
                  <span className="w-8 h-1 bg-primary rounded-full" />
                  رسالتنا
                </h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {aboutMission.mission}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

