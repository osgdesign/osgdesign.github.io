window.addEventListener('load', function () {
  const imgSlider = document.querySelector('.img-slider');
  const imgSliderTrack = document.querySelector('.img-slider-track');
  const pages = document.querySelectorAll('.page');
  const imgIndicator = document.querySelector('.img-indicator');
  const dots = imgIndicator ? imgIndicator.querySelectorAll('.dot') : [];

  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  let currentIndex = 0;
  let autoSlideInterval;
  // 복사본을 제외한 실제 이미지 개수
  const realPageCount = pages.length - 1;

  function updateSlider(withTransition = true) {
    imgSliderTrack.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
    imgSliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    // 인디케이터: 마지막(복사본)에 있을 때는 0번 점 활성화
    const activeIndex = currentIndex === realPageCount ? 0 : currentIndex;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });

    // 버튼 제어: 무한 슬라이드이므로 버튼은 항상 보이게 설정
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
      // 다음 페이지로 이동
      currentIndex++;
      updateSlider();

      // 마지막(복사본)에 도착하면 즉시 0번 인덱스로 점프
      if (currentIndex === realPageCount) {
        setTimeout(() => {
          currentIndex = 0;
          updateSlider(false); // 애니메이션 없이 즉시 이동
        }, 500); // CSS transition 시간과 맞춰주세요
      }
    }, 3000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // 좌우 버튼 로직 (무한 루프 적용)
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex === 0) {
        currentIndex = realPageCount;
        updateSlider(false); // 마지막(복사본)으로 즉시 이동
        setTimeout(() => {
          currentIndex--;
          updateSlider();
        }, 20);
      } else {
        currentIndex--;
        updateSlider();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex++;
      if (currentIndex === realPageCount) {
        updateSlider();
        setTimeout(() => {
          currentIndex = 0;
          updateSlider(false);
        }, 500);
      } else {
        updateSlider();
      }
    });
  }

  // 호버 및 인디케이터, 드래그 로직은 이전과 동일
  if (imgSlider) {
    imgSlider.addEventListener('mouseenter', stopAutoSlide);
    imgSlider.addEventListener('mouseleave', startAutoSlide);
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      currentIndex = idx;
      updateSlider();
    });
  });

  // [드래그 로직은 위 방식과 맞게 인덱스 범위를 realPageCount로 제한하여 사용]
  updateSlider();
  startAutoSlide();
});
