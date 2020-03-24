package com.yunlinker.gdbs;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.PopupWindow;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.baidu.mapapi.SDKInitializer;
import com.baidu.mapapi.map.BaiduMap;
import com.baidu.mapapi.map.BitmapDescriptor;
import com.baidu.mapapi.map.BitmapDescriptorFactory;
import com.baidu.mapapi.map.InfoWindow;
import com.baidu.mapapi.map.MapStatusUpdate;
import com.baidu.mapapi.map.MapStatusUpdateFactory;
import com.baidu.mapapi.map.MapView;
import com.baidu.mapapi.map.MyLocationConfiguration;
import com.baidu.mapapi.map.MyLocationData;
import com.baidu.mapapi.map.UiSettings;
import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.utils.CoordinateConverter;

import org.json.JSONObject;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

public class MapviewActivity extends AppCompatActivity implements View.OnClickListener {
    private PopupWindow window;
    private String lat,lng,addr;
    private MapView mMapView;
    public LocationClient mLocationClient = null;
    private BaiduMap mBaiduMap;
    private MyLocationListeners myListener = new MyLocationListeners();
    private boolean isFirstIn = true;
    //经纬度
    private double mLatitude;
    private double mLongtitude;
    private BitmapDescriptor mIconLocation;
    private LatLng desLatLng;
    private InfoWindow mInfoWindow;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        SDKInitializer.initialize(this);
        mLocationClient = new LocationClient(this);
        myListener = new MyLocationListeners();
        mIconLocation = BitmapDescriptorFactory.fromResource(R.mipmap.icon_yourself_lication);
        LocationClientOption option1= new LocationClientOption();
        option1.setLocationMode(LocationClientOption.LocationMode.Hight_Accuracy);
        option1.setCoorType("bd09ll");
        option1.setIsNeedAddress(true);
        option1.setLocationNotify(true);//可选，设置是否当GPS有效时按照1S/1次频率输出GPS结果，默认false
        option1.setWifiCacheTimeOut(5*60*1000);
        option1.setOpenGps(true);
        option1.setScanSpan(5000);
        mLocationClient.setLocOption(option1);
        setContentView(R.layout.activity_mapview);
        initview();
    }

    private void initview() {
        Intent intent = getIntent();
        String obj = intent.getStringExtra("jb");
        try {
            JSONObject jb = new JSONObject(obj);
            lat = jb.getString("lat");
            lng = jb.getString("lng");
            addr = jb.getString("addr");
        }catch (Exception e){

        }

        ImageView mapback=(ImageView)findViewById(R.id.map_back);
        ImageView play_daohang=(ImageView)findViewById(R.id.play_daohang);
        TextView titleseView = (TextView)findViewById(R.id.map_title);
        TextView address = (TextView)findViewById(R.id.address);
        mMapView = (MapView)findViewById(R.id.bmapView);
        titleseView.setText(addr);
        address.setText(addr);


        // 开启定位图层
        mBaiduMap = mMapView.getMap();
        mBaiduMap.setMapType(BaiduMap.MAP_TYPE_NORMAL);
        mLocationClient.registerLocationListener(myListener);

        UiSettings mUiSettings = mBaiduMap.getUiSettings();
        mUiSettings.setOverlookingGesturesEnabled(false);
        mUiSettings.setRotateGesturesEnabled(false);

        MapStatusUpdate mus=  MapStatusUpdateFactory
                .zoomBy(5.0f);
        mBaiduMap.setMapStatus(mus);
        mBaiduMap.setMyLocationEnabled(true);//显示定位层并且可以触发定位,默认是flase


        mapback.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });


        play_daohang.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dhPopupView();
            }
        });

    }

    @RequiresApi(api= Build.VERSION_CODES.KITKAT)
    public void dhPopupView() {
        View popupView = getLayoutInflater().inflate(R.layout.map_navgation_sheet, null);
        TextView baidu_btn = (TextView) popupView.findViewById(R.id.baidu_btn);
        TextView gaode_btn = (TextView)popupView.findViewById(R.id.gaode_btn);
        TextView tencent_btn = (TextView)popupView.findViewById(R.id.tencent_btn);
        TextView cancel_btn2 = (TextView)popupView.findViewById(R.id.cancel_btn2);

        baidu_btn.setOnClickListener(this);
        gaode_btn.setOnClickListener(this);
        tencent_btn.setOnClickListener(this);
        cancel_btn2.setOnClickListener(this);
        // : 2016/5/17 创建PopupWindow对象，指定宽度和高度
//        window = new PopupWindow(popupView, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        window = new PopupWindow();

        window.setContentView(popupView);
        //设置宽高
        window.setWidth(ViewGroup.LayoutParams.MATCH_PARENT);
        window.setHeight(ViewGroup.LayoutParams.WRAP_CONTENT);

        // : 2016/5/17 设置动画
//        window.setAnimationStyle(R.style.popup_window_anim);
        // : 2016/5/17 设置背景颜色
        window.setBackgroundDrawable(new ColorDrawable(Color.parseColor("#88323232")));
        // : 2016/5/17 设置可以获取焦点
        window.setFocusable(true);
        // : 2016/5/17 设置可以触摸弹出框以外的区域
        window.setOutsideTouchable(true);
        // ：更新popupwindow的状态
        window.update();
        window.setClippingEnabled(false);
        Rect rect = new Rect();
        getWindow().getDecorView().getWindowVisibleDisplayFrame(rect);
        int winHeight = getWindow().getDecorView().getHeight();
        window.showAtLocation(popupView, Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL, 0, winHeight - rect.bottom);
    }
    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.baidu_btn:
                baiduMap();
                break;
            case R.id.gaode_btn:
                gaodeMap();
                break;
            case R.id.cancel_btn2:
                if (window != null) {
                    window.dismiss();
                }
                break;
        }
    }
    /*百度地图*/
    public void baiduMap() {
        if (isAvilible(MapviewActivity.this, "com.baidu.BaiduMap")) {//传入指定应用包名
            Intent il = new Intent();
            il.setData(Uri.parse("baidumap://map/direction?destination=" + desLatLng.latitude + "," + desLatLng.longitude + "&mode=driving"));
            startActivity(il);
        } else {//未安装
            //market为路径，id为包名
            //显示手机上所有的market商店
            Toast.makeText(MapviewActivity.this, "您尚未安装百度地图", Toast.LENGTH_LONG).show();
            Uri uri = Uri.parse("market://details?id=com.baidu.BaiduMap");
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            startActivity(intent);
        }
        window.dismiss();
    }

    //高德地图,起点就是定位点  startNaviGao
    // 终点是LatLng ll = new LatLng("你的纬度latitude","你的经度longitude");
    public void gaodeMap() {
        if (isAvilible(MapviewActivity.this, "com.autonavi.minimap")) {
            try{
                Intent  intent = Intent.getIntent("androidamap://navi?sourceApplication="+addr+"&poiname=我的目的地&lat="+desLatLng.latitude+"&lon="+desLatLng.longitude+"&dev=0");
                startActivity(intent);
            } catch (URISyntaxException e)
            {e.printStackTrace(); }
        }else{
            Toast.makeText(MapviewActivity.this, "您尚未安装高德地图", Toast.LENGTH_LONG).show();
            Uri uri = Uri.parse("market://details?id=com.autonavi.minimap");
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            startActivity(intent);
        }
        window.dismiss();
    }

    public static boolean isAvilible(Context context, String packageName){
        //获取packagemanager
        final PackageManager packageManager = context.getPackageManager();
        //获取所有已安装程序的包信息
        List<PackageInfo> packageInfos = packageManager.getInstalledPackages(0);
        //用于存储所有已安装程序的包名
        List<String> packageNames = new ArrayList<String>();
        //从pinfo中将包名字逐一取出，压入pName list中
        if(packageInfos != null){
            for(int i = 0; i < packageInfos.size(); i++){
                String packName = packageInfos.get(i).packageName;
                packageNames.add(packName);
            }
        }
        //判断packageNames中是否有目标程序的包名，有TRUE，没有FALSE
        return packageNames.contains(packageName);
    }


    private class MyLocationListeners implements BDLocationListener {
        @Override
        public void onReceiveLocation(BDLocation bdLocation) {
            double mlng = Double.parseDouble(lng);
            double mlat = Double.parseDouble(lat);
            LatLng latLngdd = new LatLng(mlat,mlng);
            // 将google地图、soso地图、aliyun地图、mapabc地图和amap地图所用坐标转换成百度坐标
            CoordinateConverter converter  = new CoordinateConverter();
            converter.from(CoordinateConverter.CoordType.BD09LL);
            // sourceLatLng为待转换坐标
            converter.coord(latLngdd);
            desLatLng = converter.convert();
            MyLocationData data = new MyLocationData.Builder()
                    .accuracy(bdLocation.getRadius())
                    .latitude(desLatLng.latitude)
                    .longitude(desLatLng.longitude)
                    .build();
            //设置自定义图标
            MyLocationConfiguration config=new MyLocationConfiguration(MyLocationConfiguration.LocationMode.FOLLOWING,true,mIconLocation);
            mBaiduMap.setMyLocationConfiguration(config);
            mBaiduMap.setMyLocationData(data);
            //更新经纬度
            mLatitude = bdLocation.getLatitude();
            mLongtitude=bdLocation.getLongitude();
            float radius = bdLocation.getRadius();
            if (isFirstIn){
                isFirstIn=false;
                LatLng latLng = new LatLng(desLatLng.latitude,desLatLng.longitude);
                MapStatusUpdate msu = MapStatusUpdateFactory.newLatLng(latLng);
                mBaiduMap.animateMapStatus(msu);
            }

        }
    }

    @Override
    public void onStart() {
        //开启定位
        super.onStart();
        mBaiduMap.setMyLocationEnabled(true);
        if (!mLocationClient.isStarted()){
            mLocationClient.start();
        }
        //开启方向传感器
        //myOrientationListener.start();

    }

    @Override
    public void onStop() {
        super.onStop();
        mBaiduMap.setMyLocationEnabled(false);
        mLocationClient.stop();
        //myOrientationListener.stop();
    }

    @Override
    public void onPause() {
        super.onPause();
        // activity 暂停时同时暂停地图控件
        mMapView.onPause();
    }


    @Override
    public void onResume() {
        super.onResume();
        // activity 恢复时同时恢复地图控件
        mMapView.onResume();

    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        // activity 销毁时同时销毁地图控件
        mMapView.onDestroy();
        mLocationClient.stop();//关闭定位
        mBaiduMap.setMyLocationEnabled(false);
    }
}
