import { Button, Flex, Image } from "antd";

export default function FacilityPositionManagement() {
  return (
    <Flex vertical gap="middle">
      <Flex justify="space-between">
        <Button>위치설정</Button>
        <Flex gap="middle">
          <Button>위치 지정 핀</Button>
          <Button>사용 중 위치</Button>
          <Button>초기화</Button>
        </Flex>
      </Flex>
      <Flex justify="center">
        <Image alt="map" width="800px" height="600px" src="/map.png" />{" "}
      </Flex>
    </Flex>
  );
}
