package com.testcode;

public class Main {
    public static void main (String[] args) {

        int x = 7;
        int y = 3;
        int a = 5;
        int b = 9;

        boolean result = x<y || a<b;
        System.out.println(!result);

        Solution sol = new Solution();
        try{
            System.out.println(sol.sum(50, 60)); // Valid input
            System.out.println(sol.sum(150, 60)); // Invalid input, should throw exception
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }

        System.out.println("WT VF"+sol.sleepIn(true, false)); 
        System.out.println("WF VT"+sol.sleepIn(false, true));
        System.out.println("WF VF"+sol.sleepIn(false, false));
        System.out.println("WT VT"+sol.sleepIn(true, true));
    }
}
