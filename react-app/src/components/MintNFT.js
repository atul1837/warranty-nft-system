import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import {
  Input,
  Button,
  Col,
  Form,
  DatePicker,
  Row,
  Switch,
  Upload,
  Typography,
  Image,
} from "antd";

import moment from "moment";
import { create } from "ipfs-http-client";
import Loader from "./Loader";

const MintNFT = () => {
  const [buffer, setBuffer] = useState("");
  const [imageIPFS, setImageIPFS] = useState("");
  const [isTransferable, setIsTransferable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ipfsClient = create({
    url: "https://ipfs.infura.io:5001/api/v0",
  });

  useEffect(() => {
    try {
      const upload = async () => {
        if (ipfsClient && buffer) {
          console.log("inside buf", buffer);
          const result = await ipfsClient.add(buffer);

          if (result && result.path) {
            console.log(result, result.path);
            setImageIPFS(result.path);
          }
        }
      };

      upload();
    } catch (err) {
      console.log("err", err);
    }
  }, [ipfsClient, buffer]);

  const handleImageUpload = (file) => {
    try {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        setBuffer(e.target.result);
      };

      return true;
    } catch (err) {
      console.log("Err", err);
      return false;
    }
  };

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = async (values) => {
    setIsLoading(true);
    // "walletAddress": "0x11",
    const warrantyJSON = {
      name: values.productName,
      image: `ipfs://${imageIPFS}`,
      description: values.productDescription,
      attributes: [
        { warranty_duration: values.warrantyDuration },
        { product_serial_number: values.productSerialNumber },
        { product_price: values.productPrice },
        { date_of_purchase: moment(values.dateOfPurchase).unix() },
        { is_transferable: values.isWarrantyTranserable },
        { number_of_transfers: values.warrantyTransfers || 0 },
      ],
    };

    const result = await ipfsClient.add(JSON.stringify(warrantyJSON));
    if (result && result.path) {
      const tokenUri = `ipfs://${result.path}`;
      console.log(tokenUri);

      // call mint nft
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Row>
      <Col span={10} offset={7}>
        <Form
          style={{
            margin: "2rem",
            padding: "2rem",
            background: "#fff",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            borderRadius: "2rem",
            boxShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          }}
          name="mint warranty nft"
          onFinish={onFinish}
        >
          <Form.Item style={{ textAlign: "center" }}>
            <Typography.Title
              className="ant-form-text"
              level={4}
              style={{
                textTransform: "uppercase",
                fontFamily: "Roboto",
              }}
            >
              Warranty Card Details
            </Typography.Title>
          </Form.Item>

          <Form.Item name="walletAddress" label="Wallet Address" required>
            <Input placeholder="Please input customer's public wallet address" />
          </Form.Item>

          <Form.Item name="productName" label="Product Name" required>
            <Input placeholder="Please input product's name" />
          </Form.Item>

          <Form.Item
            name="productSerialNumber"
            label="Product Serial No"
            required
          >
            <Input placeholder="Please input product's serial number" />
          </Form.Item>

          <Form.Item name="productDescription" label="Product Description">
            <Input.TextArea
              rows={1}
              placeholder="Please input product's description"
            />
          </Form.Item>

          <Form.Item name="productPrice" label="Product Price" required>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Please input product's price"
            />
          </Form.Item>

          <Form.Item label="Date of Purchase" name="dateOfPurchase">
            <DatePicker />
          </Form.Item>

          <Form.Item
            name="warrantyDuration"
            label="Warranty Duration (in days)"
            required
          >
            <Input
              type="number"
              min="1"
              placeholder="Please input product's warranty duration"
            />
          </Form.Item>

          <Form.Item
            name="isWarrantyTranserable"
            label="Is Warranty Transferable?"
            valuePropName="checked"
          >
            <Switch
              checked={isTransferable}
              onChange={() => setIsTransferable(!isTransferable)}
            />
          </Form.Item>

          {isTransferable && (
            <Form.Item name="warrantyTransfers" label="Number of Transfers">
              <Input
                type="number"
                min="1"
                placeholder="Please input number of transfer's allowed"
              />
            </Form.Item>
          )}

          <Form.Item label="Product Image">
            <Form.Item
              name="productImage"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
            >
              <Upload.Dragger
                listType="picture"
                showUploadList={{ showRemoveIcon: true }}
                accept=".png,.jpeg,.jpg,.svg"
                beforeUpload={handleImageUpload}
                name="files"
                maxCount={1}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <Typography.Text className="ant-upload-text">
                  Click or Drag File to this Area to Upload
                </Typography.Text>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>

          {imageIPFS && (
            <Image
              height={200}
              src={`https://ipfs.io/ipfs/${imageIPFS}`}
              alt="uploaded image"
            />
          )}

          <Button type="primary" htmlType="submit">
            Generate NFT
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default MintNFT;
