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
} from "antd";
import React from "react";

const normFile = (e) => {
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const MintNFT = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

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
          name="validate_other"
          //   {...formItemLayout}
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
            <Switch />
          </Form.Item>

          <Form.Item label="Product Image">
            <Form.Item
              name="productImage"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
            >
              <Upload.Dragger name="files" action="/upload.do" maxCount={1}>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <Typography.Text className="ant-upload-text">
                  Click or Drag File to this Area to Upload
                </Typography.Text>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Generate NFT
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default MintNFT;
