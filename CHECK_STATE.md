;
  const filteredTimelineItems = timelineItems.filter(item => {
    if (timelineFilter === 'all') return item.category !== 'first' && item.category !== 'album';
    return item.category === timelineFilter;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeVideoTab, setActiveVideoTab] = useState('p1');
  const [activeYearTab, setActiveYearTab] = useState('all');
  const [activeTimelineVideo, setActiveTimelineVideo] = useState<{type: 'youtube' | 'facebook', url: string, videoId?: string} | null>(null);
  const location = useLocation();

  const handleTimelineClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    const target = e.target as HTMLElement;
    const aTag = target.