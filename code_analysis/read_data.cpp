#include <iostream>
#include <fstream>
#include <set>
#include <algorithm>
#include <unordered_set>
using namespace std;

string get_address(string & data_line) {
	return data_line.substr(0, data_line.find_first_of(','));
}
int main() {
	unordered_set<string> address_set;
	ifstream fin;
	fin.open("./ContractInfo_queYixie/ContractInfo_queHenduo.csv");
	string s;
	if (fin.is_open()) {
		getline(fin, s);
		while (!fin.eof()){
			getline(fin, s);
			address_set.insert(get_address(s));
			//cout << get_address(s) << endl;
		}
	}
	cout << address_set.size() << endl;
	fin.close();
	
	//
	ofstream fout("contract_address_list.csv");
	fout << "contract_address" << endl;
	for (auto iter = address_set.begin(); iter != address_set.end(); ++iter) {
		fout << *iter << endl;
	}
	fout.close();
	return 0;
} 
