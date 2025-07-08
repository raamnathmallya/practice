package com.testcode;

class Solution {
    public int sum(int num1, int num2) {
        if (num1<-100 || num1>100 || num2<-100 || num2>100){
            throw new IllegalArgumentException("numbers out of bound");            
        }
        return num1+num2;
    };
    public boolean sleepIn(boolean weekday, boolean vacation) {
        return !weekday || vacation;
  }   
}