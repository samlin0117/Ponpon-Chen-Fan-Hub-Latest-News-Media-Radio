=== All occurrences of filteredTimelineItems ===
timelineItems = t.timelineItems as any[];
  const filteredTimelineItems = timelineItems.filter(item => {
    if (timelineFilter === 'all') return item.category !== 'first' && item.category !== 'album';
    return item.category === timelineFilter;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeVideoTab, setActiveVideoTab
======
="space-y-16 md:space-y-24">
                    {filteredTimelineItems.map((item, index) => {
                      const isEven = index % 2 === 0;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView=
======

=== Where filteredTimelineItems is rendered (map) ===
d:left-1/2 md:-ml-[1px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

                  <div className="space-y-16 md:space-y-24">
                    {filteredTimelineItems.map((item, index) => {
                      const isEven = index % 2 === 0;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className={`relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''} group`}
      