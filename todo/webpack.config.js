const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'todo',

  exposes: {
    './TodoModule': './src/app/remote.routes.ts',
  },

  shared: {
    ...shareAll({ 
      singleton: true, //ให้แต่ละ lib มี instance เดียวทั้งระบบ (shell + remote) Service ไม่ share
      strictVersion: false, //ไม่บังคับว่าเวอร์ชันต้องตรงเป๊ะ
      requiredVersion: false, //ไม่เช็ค package.json ว่าต้องใช้เวอร์ชันไหน
      eager: false //ไม่โหลด shared lib ตั้งแต่ต้น โหลด lib เมื่อมี remote ถูกเรียกจริง
    }),
  },

});
