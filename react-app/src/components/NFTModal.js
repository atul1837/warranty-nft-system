import { Modal } from "antd";

const NFTModal = ({ isModalVisible, setIsModalVisible }) => (
  <Modal
    title="Vertically centered modal dialog"
    centered
    visible={isModalVisible}
    onOk={() => setIsModalVisible(false)}
    onCancel={() => setIsModalVisible(false)}
  >
    <p>some contents...</p>
    <p>some contents...</p>
    <p>some contents...</p>
  </Modal>
);

export default NFTModal;
