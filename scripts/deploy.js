async function main() {
    const WarrantyCard = await ethers.getContractFactory("WarrantyFactory")
  
    // Start deployment, returning a promise that resolves to a contract object
    const warrantyCard = await WarrantyCard.deploy()
    await warrantyCard.deployed()
    console.log("Contract deployed to address:", warrantyCard.address)
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  