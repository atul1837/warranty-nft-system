import moment from "moment";

import { useState } from "react";
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
  Spin,
} from "antd";

import Loader from "./Loader";
import showNotification from "../utilities/notifications";
import { sendNftMail } from "../services/mailer/nftMail";

const MintNFT = ({ contractAddress, ipfsClient, nftContract }) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageIPFS, setImageIPFS] = useState("");
  const [isTransferable, setIsTransferable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const mintWarrantyNFT = async (
    productSerialNumber,
    warrantyDuration,
    warrantyTransfers,
    walletAddress,
    tokenUri,
    email
  ) => {
    try {
      const nftTxn = await nftContract.mintWarrantyCard(
        productSerialNumber,
        warrantyDuration,
        warrantyTransfers,
        walletAddress,
        tokenUri
      );

      await nftTxn.wait();
      if (nftTxn.hash && nftTxn.value) {
        showNotification(
          "NFT Minted Successfully",
          "success",
          `Transaction Hash: ${nftTxn.hash}`
        );
        sendNftMail(
          email,
          contractAddress,
          parseInt(nftTxn.value._hex, 16),
          walletAddress,
          nftTxn.hash
        );
      }
    } catch (err) {
      showNotification("NFT Mint Failed", "error", err.message);
    }
  };

  const handleImageUpload = (options) => {
    const { onSuccess, onError, file } = options;
    try {
      setIsImageLoading(true);
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        let buffer = e.target.result;
        try {
          const upload = async () => {
            console.log("ipfs client ", ipfsClient);
            if (ipfsClient && buffer) {
              const result = await ipfsClient.add(buffer);

              if (result && result.path) {
                console.log(result, result.path);
                setImageIPFS(result.path);
              }
            }
          };

          upload().then((result) => {
            setIsImageLoading(false);
          });
        } catch (err) {
          setIsImageLoading(false);
          console.log("err", err);
        }
      };
      onSuccess(true);
      return true;
    } catch (err) {
      setIsImageLoading(false);
      onError(true);
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
      attributes: [
        {
          trait_type: "email",
          value: values.email,
        },
        {
          trait_type: "warranty_duration",
          value: values.warrantyDuration,
        },
        {
          trait_type: "product_serial_number",
          value: values.productSerialNumber,
        },
        {
          trait_type: "product_price",
          value: values.productPrice,
        },
        {
          trait_type: "date_of_purchase",
          value: moment(values.dateOfPurchase).unix(),
        },
      ],
      description: values.productDescription,
      image: `ipfs://${imageIPFS}`,
      name: values.productName,
    };

    const result = await ipfsClient.add(JSON.stringify(warrantyJSON));
    if (result && result.path) {
      const tokenUri = `ipfs://${result.path}`;
      console.log(tokenUri);

      await mintWarrantyNFT(
        values.productSerialNumber,
        values.warrantyDuration,
        values.warrantyTransfers || 0,
        values.walletAddress,
        tokenUri,
        values.email
      );
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

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Please input customer's email address" />
          </Form.Item>

          <Form.Item
            name="walletAddress"
            label="Wallet Address"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Please input customer's public wallet address" />
          </Form.Item>

          <Form.Item
            name="productName"
            label="Product Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Please input product's name" />
          </Form.Item>

          <Form.Item
            name="productSerialNumber"
            label="Product Serial No"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Please input product's serial number" />
          </Form.Item>

          <Form.Item name="productDescription" label="Product Description">
            <Input.TextArea
              rows={1}
              placeholder="Please input product's description"
            />
          </Form.Item>

          <Form.Item
            name="productPrice"
            label="Product Price"
            rules={[
              {
                required: true,
              },
            ]}
          >
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
            rules={[
              {
                required: true,
              },
            ]}
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
                showUploadList={false}
                accept=".png,.jpeg,.jpg,.svg"
                customRequest={handleImageUpload}
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
          {isImageLoading && <Spin />}
          {imageIPFS && (
            <Image
              height={200}
              src={`https://ipfs.io/ipfs/${imageIPFS}`}
              alt="uploaded image"
            />
          )}

          <Button type="primary" htmlType="submit" disabled={!imageIPFS}>
            Generate NFT
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default MintNFT;
