const embla = EmblaCarousel(emblaNode, {
  loop: true,
  draggable: true,
  align: 'center',    // 设置幻灯片对齐方式
  containScroll: 'trimSnaps',  // 保证所有幻灯片在视口内
  slidesToScroll: 1   // 每次滚动幻灯片数量
});
