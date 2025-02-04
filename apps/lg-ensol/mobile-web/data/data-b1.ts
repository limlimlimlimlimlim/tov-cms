const data = {
  id: 6,
  floorName: 'B1',
  wing: [
    {
      id: 60,
      name: '전체',
      image: '/images/sample/map/b1/map.png',
      facility: [
        {
          id: 600,
          name: '오사이초밥',
          image: '/images/sample/facility/04.png',
          section: '/images/sample/map/b1/section4.png',
          phone: '02-2122-5425',
          address: 'B1 120호',
          description:
            '오사이초밥을 통해 모두가 행복해지면 좋겠다는 생각! 좋은 먹거리, 깨끗한 환경, 건강한 외식기업의 기준이 되겠습니다. 대표 메뉴 및 가격: 런치 19,000원 / 디너 29,000원',
          openingHours: '11:00 ~ 21:00',
          initial: 'ㅇㅅㅇㅊㅂ, ㅊㅂ, ㅇㅅㅇ, ㅇㅅ',
          floor: 'B1',
          wing: '전체',
          floorId: 6,
          wingId: 60,
          x: 108,
          y: -32,
        },
        {
          id: 14,
          name: '루이키친',
          image: '/images/sample/facility/05.png',
          section: '/images/sample/map/b1/section5.png',
          phone: '02-736-8889',
          address: 'B1 121호',
          description:
            '수준 높은 음식을 선보이는 여경래 셰프의 프리미엄 중식 레스토랑 대표 메뉴 및 가격 : 불도장 99,000원 / 유린기 30,000원',
          openingHours: '11:00 ~ 21:00',
          initial: 'ᄅᄋᄏᄎ, ᄅᄋ, ᄏᄎ, ᄌᄉ,ᄌᄀᄌ',
          floor: 'B1',
          wing: '전체',
          floorId: 6,
          wingId: 60,
          x: 145,
          y: -32,
        },
        {
          id: 15,
          name: '띤띤',
          image: '/images/sample/facility/06.png',
          section: '/images/sample/map/b1/section6.png',
          phone: '02-318-5501',
          address: 'B1 122호',
          description:
            '수준 높은 음식을 선보이는 여경래 셰프의 프리미엄 중식 레스토랑 대표 메뉴 및 가격 : 분짜 16,000원 / 매운해산물 쌀국수 15,000원',
          openingHours: '12:00 ~ 21:00',
          initial: 'ᄃᄃ, ᄋᄉᄋ, ᄉᄀᄉ',
          floor: 'B1',
          wing: '전체',
          floorId: 6,
          wingId: 60,
          x: 181,
          y: -38,
        },
        {
          id: 16,
          name: '감성타코',
          image: '/images/sample/facility/07.png',
          section: '/images/sample/map/b1/section7.png',
          phone: '02-2245-5664',
          address: 'B1 123호',
          description:
            '이름처럼 감성 넘치는 매장 분위기가 매력적인 감성타코에서 동료들과 함께 대표 메뉴인 파히타를 즐겨보세요! 대표 메뉴 및 가격 : 감성 그릴드 파히타 43,800원 / 까르니따스 치즈 타코 10,000원',
          openingHours: '11:00 ~ 21:00',
          initial: 'ㄱㅅㅌㅋ, ㅌㅋ, ㄱㅅ, ㅁㅅㅋ',
          floor: 'B1',
          wing: '전체',
          floorId: 6,
          wingId: 60,
          x: 195,
          y: -32,
        },
        {
          id: 17,
          name: 'Ckbg.lab',
          image: '/images/sample/facility/08.png',
          section: '/images/sample/map/b1/section8.png',
          phone: '02-318-5501',
          address: 'B1 124호',
          description:
            '수제 바비큐로 유명한 유용욱 소장의 버거 브랜드 매콤한 치킨 패티가 특징인 내슈빌 스타일 버거를 맛보실 수 있어요! 대표 메뉴 및 가격 : 오리지널 치킨버거 9,800원 / 베이컨 치킨버거 12,800원',
          openingHours: '10:00 ~ 21:00',
          initial: 'ㅎㅂㄱ, ckbg, ㅅㅋㅂㅈ',
          floor: 'B1',
          wing: '전체',
          floorId: 6,
          wingId: 60,
          x: 206,
          y: -32,
        },
        {
          id: 18,
          name: '아우어베이커리',
          image: '/images/sample/facility/09.png',
          section: '/images/sample/map/b1/section2.png',
          phone: '02-2468-6544',
          address: 'B1 125호',
          description:
            '전지적참견시점 이영자맛집 빵이 맛있는 아우어베이커리 대표 메뉴 및 가격 : 아메리카노 5,200원 / 더티초코 5,500원',
          openingHours: '11:00 ~ 22:00',
          initial: 'ㅎㅇㅇㅇ,ㅇㅇㅇㅂㅇㅋㄹ,ㅂㅇㅋㄹ,ㅋㅂ',
          floor: 'B1',
          wing: '전체',
          floorId: 6,
          wingId: 60,
          x: 145,
          y: 85,
        },
        {
          id: 19,
          name: '잠바주스',
          image: '/images/sample/facility/10.png',
          section: '/images/sample/map/b1/section3.png',
          phone: '02-2866-7585',
          address: 'B1 126호',
          description:
            '미국의 음료 브랜드로 신선한 제철 과채를 활용한 음료를 즐겨보세요! 대표 메뉴 및 가격 : 레드비트 베리보울 12,900원 / 블루베리바나나 7,200원',
          openingHours: '11:00 ~ 22:00',
          initial: 'ᄒᄋᄌᄇᄌᄉ, ᄌᄉ, ᄌᄇ, ᄏᄑ',
          floor: 'B1',
          wing: '전체',
          floorId: 6,
          wingId: 60,
          x: 175,
          y: 80,
        },
        {
          id: 20,
          name: '푸드코트',
          image: '/images/sample/facility/11.png',
          section: '/images/sample/map/b1/section1.png',
          phone: '02-2981-1566',
          address: 'B1 130호',
          description:
            '한식, 일식, 중식, 양식, 분식 등의 여러 종류의 음식을 드셔보세요!',
          openingHours: '11:00 ~ 22:00',
          initial: 'ᄑᄃᄏᄐ, ᄉᄃ',
          floor: 'B1',
          wing: '전체',
          floorId: 6,
          wingId: 60,
          x: 20,
          y: 11,
        },
      ],
    },
  ],
};
export default data;
